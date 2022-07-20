<?php

namespace App\Utilities;

/**
 * Cookie:
 *
 * @author Igor Veselov <dev@xfor.top>
 */
class Cookie
{

    /**
     * Delete:
     * @access public
     * @param string $key
     * @return void
     */
    public static function delete($key)
    {
        if (self::exists($key)) {
            setcookie($key, '', time() - 1, '/');
        }
    }

    /**
     * Exists:
     * @access public
     * @param string $key
     * @return boolean
     */
    public static function exists($key): bool
    {
        return isset($_COOKIE[$key]);
    }

    /**
     * Get: Returns the value of a specific key of the COOKIE super-global
     * @access public
     * @param string $key
     * @return string
     */
    public static function get($key): string
    {
        if (self::exists($key)) {
            return $_COOKIE[$key];
        } else {
            return '';
        }
    }

    /**
     * Put:
     * @access public
     * @param string $key
     * @param string $value
     * @param integer $expiry
     * @return boolean
     */
    public static function put($name, $value, $expire, $path, $samesite = "", $secure = false, $httponly = false): bool
    {
        // return setcookie($key, $value, time() + $data, '/');

        // if (PHP_VERSION_ID < 70300) {
        // return setcookie($name, $value, time() + $expire, $path, $domain, $secure, $httponly);
        // }
        // return setcookie($name, $value, [
        //     'expires' => $expire,
        //     'path' => $path,
        //     'domain' => $domain,
        //     'samesite' => $samesite,
        //     'secure' => $secure,
        //     'httponly' => $httponly,
        // ]);
        // return setcookie('cookie_name', 'cookie_value', time() + 60 * 60 * 24 * 30, '/; SameSite=strict');
        $arr_cookie_options = array(
            'expires' => time() + $expire,
            'path' => $path,
            // 'domain' => 'ecom.test', // leading dot for compatibility or use subdomain
            'secure' => $secure,     // or false
            'httponly' => $httponly,    // or false
            'samesite' => $samesite // None || Lax  || Strict
        );
        return setcookie($name, $value, $arr_cookie_options);
    }
}
