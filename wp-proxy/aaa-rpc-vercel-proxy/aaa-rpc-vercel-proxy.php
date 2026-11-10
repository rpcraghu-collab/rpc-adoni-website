<?php
/**
 * Plugin Name: RPC Vercel Proxy
 * Description: Shows the new RPC Adoni website (hosted on Vercel) on rpcadoni.com. wp-admin keeps working. Deactivate this plugin to bring back the old WordPress site.
 * Version: 1.0.0
 * Author: Dream Team Services
 */

if (!defined('ABSPATH')) {
    exit;
}

function rpc_vp_send_error($code, $text)
{
    http_response_code($code);
    header('Content-Type: text/plain; charset=utf-8');
    header('Cache-Control: no-store');
    echo $text;
    exit;
}

function rpc_vp_run()
{
    $upstream = 'https://rpc-adoni.vercel.app';
    $apex = 'rpcadoni.com';

    $uri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '/';
    if ($uri === '' || $uri[0] !== '/') {
        $uri = '/' . $uri;
    }
    $host = strtolower(isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : $apex);

    // www and http -> https://rpcadoni.com (one hop)
    $https = is_ssl() || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && strtolower($_SERVER['HTTP_X_FORWARDED_PROTO']) === 'https');
    if ($host !== $apex || !$https) {
        header('Location: https://' . $apex . $uri, true, 301);
        exit;
    }

    $method = strtoupper(isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : 'GET');
    if ($method !== 'GET' && $method !== 'HEAD') {
        header('Allow: GET, HEAD');
        rpc_vp_send_error(405, 'Method not allowed');
    }

    $fwd = array();
    $pass = array(
        'HTTP_ACCEPT' => 'Accept',
        'HTTP_ACCEPT_LANGUAGE' => 'Accept-Language',
        'HTTP_USER_AGENT' => 'User-Agent',
        'HTTP_IF_NONE_MATCH' => 'If-None-Match',
        'HTTP_IF_MODIFIED_SINCE' => 'If-Modified-Since',
        'HTTP_RANGE' => 'Range',
        'HTTP_REFERER' => 'Referer',
    );
    foreach ($pass as $key => $name) {
        if (!empty($_SERVER[$key])) {
            $fwd[] = $name . ': ' . str_replace(array("\r", "\n"), '', $_SERVER[$key]);
        }
    }
    if (!empty($_SERVER['REMOTE_ADDR'])) {
        $fwd[] = 'X-Forwarded-For: ' . $_SERVER['REMOTE_ADDR'];
    }
    $fwd[] = 'X-Forwarded-Host: ' . $apex;

    $resp_headers = array();
    $ch = curl_init($upstream . $uri);
    curl_setopt_array($ch, array(
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_ENCODING => '',
        CURLOPT_CONNECTTIMEOUT => 8,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTPHEADER => $fwd,
        CURLOPT_NOBODY => ($method === 'HEAD'),
        CURLOPT_HEADERFUNCTION => function ($c, $line) use (&$resp_headers) {
            $len = strlen($line);
            if (strpos($line, ':') !== false) {
                list($k, $v) = explode(':', $line, 2);
                $resp_headers[] = array(strtolower(trim($k)), trim($v));
            } elseif (stripos($line, 'HTTP/') === 0) {
                $resp_headers = array(); // new response block
            }
            return $len;
        },
    ));
    $body = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    $err = curl_errno($ch);
    curl_close($ch);

    if ($err || $body === false || $status < 100) {
        rpc_vp_send_error(502, 'The website is temporarily unavailable. Please try again in a minute.');
    }

    while (ob_get_level() > 0) {
        ob_end_clean();
    }
    if (function_exists('header_remove')) {
        header_remove('X-Powered-By');
        header_remove('Set-Cookie');
    }

    http_response_code($status);
    $skip = array(
        'content-encoding', 'content-length', 'transfer-encoding', 'connection', 'keep-alive',
        'server', 'date', 'age', 'set-cookie', 'strict-transport-security', 'alt-svc',
    );
    foreach ($resp_headers as $h) {
        list($k, $v) = $h;
        if (in_array($k, $skip, true) || strpos($k, 'x-vercel') === 0) {
            continue;
        }
        if ($k === 'location') {
            $v = str_replace($upstream, 'https://' . $apex, $v);
        }
        header($k . ': ' . $v, false);
    }

    // Short server cache on Hostinger (LiteSpeed): hashed assets for a week, pages for 5 minutes.
    $path = parse_url($uri, PHP_URL_PATH);
    if ($method === 'GET' && $status === 200 && $path !== '/version.json') {
        $ttl = (strpos($path, '/assets/') === 0) ? 604800 : 300;
        header('X-LiteSpeed-Cache-Control: public,max-age=' . $ttl);
        header('X-LiteSpeed-Tag: rpc_vercel_proxy');
    } else {
        header('X-LiteSpeed-Cache-Control: no-cache');
    }

    if ($method !== 'HEAD') {
        header('Content-Length: ' . strlen($body));
        echo $body;
    }
    exit;
}

(function () {
    if (defined('WP_CLI') || defined('DOING_CRON') || defined('DOING_AJAX') || is_admin()) {
        return;
    }
    if (!function_exists('curl_init') || isset($_GET['rest_route'])) {
        return;
    }
    $path = parse_url(isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '/', PHP_URL_PATH);
    if (!is_string($path)) {
        $path = '/';
    }
    // WordPress's own paths stay with WordPress so wp-admin and logins keep working.
    if (preg_match('#^/(wp-admin|wp-login\.php|wp-json|wp-cron\.php|xmlrpc\.php|wp-content|wp-includes|wp-signup\.php|wp-activate\.php|wp-comments-post\.php|wp-trackback\.php)#i', $path)) {
        return;
    }
    rpc_vp_run();
})();
