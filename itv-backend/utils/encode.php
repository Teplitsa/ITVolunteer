<?php

namespace ITV\utils;

function base64url_encode($data) {
  $b64 = base64_encode($data);
  return rtrim(strtr($b64, '+/', '-_'), '=');
}

function base64url_decode($data, $strict = false) {
  $b64 = strtr($data, '-_', '+/');
  return base64_decode($b64, $strict);
}