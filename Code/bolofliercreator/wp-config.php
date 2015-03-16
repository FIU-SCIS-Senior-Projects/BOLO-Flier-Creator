<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, and ABSPATH. You can find more information by visiting
 * {@link http://codex.wordpress.org/Editing_wp-config.php Editing wp-config.php}
 * Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'bolo_creator');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', '');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '<%`nmMvK{V<|Y j%6l]1-?^!)[ZQgyoR#HH?J,0X4I[6/tp%FP<&^4Lsev*=MqNu');
define('SECURE_AUTH_KEY',  'xK/FI{PBJ;!!W|pYvxieu8uaty?<{ma#9-s~bohg~rSD0yfJ|O/6ndty&Kg|Y_:x');
define('LOGGED_IN_KEY',    '$[~^!t%#|TrkF|n]aTqWqx.+y-Q8~J~rwzNpT.NuM@lwl1N$-7,I*<o:{.,so|8,');
define('NONCE_KEY',        '&f@|u%TGVIk#u/98+zr~OPjE5c-z}|.p_&+qswh/hgVPK39Lv4W}^`Z%2^hI-t!>');
define('AUTH_SALT',        'TeExn6YU`~%Pl3|Q5c-5.tpX&m#EkXE9%/MJ~pKl{n,a^4}IFR|U:4E=-GQF&f$`');
define('SECURE_AUTH_SALT', '~39[qF93Vu-b&8@y<x4PRC@uv&9{D{,*D0)%emh-0t~6G@9r<R6Q?JMHQZdavq+$');
define('LOGGED_IN_SALT',   'N )do+As*@KHU$71yQY2tZ4Rm5VvLj7D--+6U&K|-8JSm#-HJk_+@Xpq3O%9AnG:');
define('NONCE_SALT',       '0m<PD/<U%_Bxjk!j,)ReF/U1FNj}mNA4TJK]6]nQbtRmQ,]Qh8[&q.#&8{,*u;zW');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
