<?php
/**
 * The Template for displaying all single posts.
 *
 * @package Inkness
 */

get_header(); ?>

	<div id="primary" class="content-area col-md-8">
		<main id="main" class="site-main" role="main">

		<?php while ( have_posts() ) : the_post(); ?>

			<?php get_template_part( 'content', 'single' ); ?>

			<?php inkness_content_nav( 'nav-below' ); ?>

			<?php
				// If comments are open or we have at least one comment, load up the comment template
				if ( comments_open() || '0' != get_comments_number() )
					comments_template();
			?>

		<?php endwhile; // end of the loop. ?>

<div id="postbox">
<form id="new_post" name="new_post" action=<?php echo get_template_directory_uri();?>../retrievedata.php" method="post" >
<p><label for="title">Title</label><br />
<input type="text" id="title" value="" tabindex="1" size="20" name="title" />
</p>
<p><label for="description">Description</label><br />
<textarea id="description" tabindex="3" name="description" cols="50" rows="6"></textarea>
</p>
<p><?php wp_dropdown_categories( 'show_option_none=Category&tab_index=4&taxonomy=category' ); ?></p>
<p><label for="post_tags">Tags</label>
<input type="text" value="" tabindex="5" size="16" name="post_tags" id="post_tags" /></p>
<p align="right"><input type="submit" value="Publish" tabindex="6" id="submit" name="submit" /></p>
<input type="hidden" name="action" value="new_post" />
<?php wp_nonce_field( 'new-post' ); ?>
</form>
</div>


		</main><!-- #main -->
	</div><!-- #primary -->

<?php get_sidebar(); ?>
<?php get_sidebar('footer'); ?>
<?php get_footer(); ?>