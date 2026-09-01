<?php return ['jwt'=>['secret'=>env('JWT_SECRET','change-me'),'days'=>(int)env('JWT_EXPIRES_DAYS',30)]];
