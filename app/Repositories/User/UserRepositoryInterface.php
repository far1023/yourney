<?php

namespace App\Repositories\User;

interface UserRepositoryInterface
{
    public function userDataTable($request);
    public function createUser($request);
    
    // Add these new methods for our CRUD operations
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
}
