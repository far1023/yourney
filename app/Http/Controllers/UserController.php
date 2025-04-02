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
    
    /**
     * Store a newly created user.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'sometimes|string|min:8',
            ]);
            
            $user = $this->repo->create($validated);
            
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'User created successfully',
                    'data' => $user
                ], 200);
            }
            
            return redirect()->back()->with('success', 'User created successfully');
        } catch (\Illuminate\Validation\ValidationException $ve) {
            throw $ve;
        } catch (\Throwable $th) {
            defer(fn () => Log::error('UserController store error: ' . $th->getMessage(), [
                'message' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ]));

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'An unexpected error occurred.',
                    'error' => $th->getMessage()
                ], 500);
            }
            
            return redirect()->back()->withErrors([
                'error' => 'An unexpected error occurred: ' . $th->getMessage()
            ]);
        }
    }
    
    /**
     * Update the specified user.
     */
    public function update(Request $request, $id)
    {
        try {
            // Different validation for update - email unique except current user
            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
                'password' => 'sometimes|string|min:8',
            ]);
            
            $user = $this->repo->update($id, $validated);
            
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'User updated successfully',
                    'data' => $user
                ], 200);
            }
            
            return redirect()->back()->with('success', 'User updated successfully');
        } catch (\Illuminate\Validation\ValidationException $ve) {
            throw $ve;
        } catch (\Throwable $th) {
            defer(fn () => Log::error('UserController update error: ' . $th->getMessage(), [
                'message' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ]));

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'An unexpected error occurred.',
                    'error' => $th->getMessage()
                ], 500);
            }
            
            return redirect()->back()->withErrors([
                'error' => 'An unexpected error occurred: ' . $th->getMessage()
            ]);
        }
    }
    
    /**
     * Remove the specified user.
     */
    public function destroy(Request $request, $id)
    {
        try {
            $this->repo->delete($id);
            
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'User deleted successfully'
                ], 200);
            }
            
            return redirect()->back()->with('success', 'User deleted successfully');
        } catch (\Throwable $th) {
            defer(fn () => Log::error('UserController destroy error: ' . $th->getMessage(), [
                'message' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ]));

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'An unexpected error occurred.',
                    'error' => $th->getMessage()
                ], 500);
            }
            
            return redirect()->back()->withErrors([
                'error' => 'An unexpected error occurred: ' . $th->getMessage()
            ]);
        }
    }
}
