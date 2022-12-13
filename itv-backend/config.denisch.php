<?php

namespace ITV;

class Config {
    const MONGO_CONNECTION = 'mongodb://itv-mongo:27017';

    const AUTH_EXPIRE_DAYS = 30;

    const MAIL_ABOUT_TASKS_SKIP_LIST = ['sidorenko.a@te-st.org'];
}
