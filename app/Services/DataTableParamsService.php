<?php

namespace App\Services;

use App\Contracts\DataTableParams;
use Illuminate\Http\Request;
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
        if (!empty($invalidKeys)) {
            throw ValidationException::withMessages([
                'params' => ['Invalid parameters: ' . implode(', ', $invalidKeys)]
            ]);
        }

        $validator = Validator::make($queryParams, [
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1',
        ]);

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
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
