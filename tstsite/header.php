<?php

$header_template = itv_is_v1_version() ? "header_v1" : (itv_is_spa() ? 'header_spa' : 'header_ssr');
get_template_part($header_template);
