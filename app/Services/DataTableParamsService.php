<?php

namespace App\Services;

use App\Contracts\DataTableParams;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class DataTableParamsService implements DataTableParams
{
    public $page;
    public $perPage;

    public function __construct(Request $request)
    {
        $allowedKeys = ['page', 'per_page'];
        $queryParams = $request->query();

        $invalidKeys = array_diff(array_keys($queryParams), $allowedKeys);

        $validator = Validator::make($queryParams, [
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1',
        ]);

        if (!empty($invalidKeys) || $validator->fails()) {
            $logData = [];

            if (!empty($invalidKeys)) {
                $invalidKeysData = [];
                foreach ($invalidKeys as $key) {
                    $invalidKeysData[$key] = $queryParams[$key];
                }
                $logData['invalid_keys'] = $invalidKeysData;
            }

            if ($validator->fails()) {
                $validationErrors = [];

                foreach ($validator->errors()->toArray() as $field => $errors) {
                    $validationErrors[$field] = $queryParams[$field];
                }

                $logData['validation_errors'] = $validationErrors;
            }

            Log::channel('file')->notice('User DataTable params: Invalid query params', $logData);
        }

        $this->page = $request->has('page') ? (int) $request->query('page') : 1;
        $this->perPage = $request->has('per_page') ? (int) $request->query('per_page') : 10;
    }

    public function getPage(): ?int
    {
        return $this->page;
    }

    public function getPerPage(): ?int
    {
        return $this->perPage;
    }
}
