<?php

$footer_template = itv_is_v1_version() ? "footer_v1" : (itv_is_spa() ? 'footer_spa' : 'footer_ssr');
get_template_part($footer_template);
