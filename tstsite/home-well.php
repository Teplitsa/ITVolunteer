<?php
/* well on homepage **/
?>
<div class="well">
    <div class="row">
        <div class="col-md-2">
            <div class="intro-logo">
                <?php
                $src = get_template_directory_uri().'/img/logo-v.png';
                echo "<img src='{$src}'>";
                ?>
            </div>
        </div>

        <div class="col-md-10">

            <div class="home-text"><p>
                    <?php global $post; echo $post->post_content; //the_content(); - not working for some reason ?>
                    <? //_e('it-volunteer - a platform for the exchange of tasks to provide digital services for non-profit organizations and community initiatives. Here you can either ask for help for your project or organization, and to offer it. <a href="http://help.te-st.ru/about/">Read more.</a>', 'tst');?>
                </p></div>

            <div class="home-text-buttons">
                <div class="pull-left">
                    <button class="btn btn-primary" data-toggle="modal" data-target="#myModal">
                        <span class="glyphicon glyphicon-play-circle"></span> <?php _e('Watch the video', 'tst');?>
                    </button>

                    <!-- Modal -->
                    <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                    <h4 class="modal-title" id="myModalLabel"><?php _e('About IT-Volunteer', 'tst');?></h4>
                                </div>
                                <div class="modal-body">
                                    <?php echo get_post_meta(get_the_ID(), 'video', true);?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> <!-- .pull-left -->

                <div class="pull-left">
                    <?php if(is_user_logged_in()) {?>
                        <a href="<?php echo tst_get_member_url(get_user_by('id', get_current_user_id()));?>" class="btn btn-success"><span class="glyphicon glyphicon-log-in"></span> <?php _e('Your profile', 'tst');?></a>
                    <?php } else {?>
                        <a href="<?php echo home_url('/registration/')?>" class="btn btn-success" ><span class="glyphicon glyphicon-log-in"></span> <?php _e('Register', 'tst');?></a>
                    <?php }?>

                </div><!-- .pull-left -->
            </div>
        </div>

    </div><!-- .row -->
</div>