<?php

namespace App\Http\Controllers;

use App\Exceptions\CustomException;
use App\Repositories\User\UserRepositoryInterface;
use App\Services\DataTableParamsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    protected $repo;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->repo = $userRepository;
    }

    public function userDataTable(Request $request): JsonResponse
    {
        try {
            $validatedQueryParams = new DataTableParamsService($request);

            $users = $this->repo->userDataTable($validatedQueryParams);

            return response()->json($users, 200);
        } catch (CustomException $ce) {
            return $ce->render();
        } catch (\Throwable $th) {
            defer(fn () => Log::error('UserController error: ' . $th->getMessage(), [
                'message' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ]));

            return response()->json([
                'status' => 500,
                'message' => 'An unexpected error occurred.',
                'debug' => $th->getMessage()
            ], 500);
        }
    }
}
