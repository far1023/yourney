<?php

namespace App\Repositories\User;

interface UserRepositoryInterface
{
    public function userDataTable($request);
    public function createUser($request);
}
