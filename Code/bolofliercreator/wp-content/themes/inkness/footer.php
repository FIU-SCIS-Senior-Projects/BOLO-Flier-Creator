<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after
 *
 * @package Inkness
 */
?>
	</div>
	</div><!-- #content -->

	<footer id="colophon" class="site-footer row" role="contentinfo">
	<div class="container">
	<?php if ( of_get_option('credit1', true) == 0 ) { ?>
		<div class="site-info col-md-4">
			<?php do_action( 'inkness_credits' ); ?>
					</div><!-- .site-info -->
	<?php } ?>	
		<div id="footertext" class="col-md-7">
           <p>© 2015 Village of Pinecrest. All Rights Reserved.</p>
        	        </div>
	</div>   
	</footer><!-- #colophon -->
	
</div><!-- #page -->

<?php wp_footer(); ?>
</body>
</html>