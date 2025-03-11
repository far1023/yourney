This is a boilerplate to build custom DataTable, powered with [Laravel React starter kit](https://laravel.com/docs/12.x/starter-kits#react) and [tanstack-table](https://tanstack.com/table/latest)

Just simply copy these files to your project

* customize your very own styling

`resources/js/components/datatable-pagination.tsx`

`resources/js/components/datatable.tsx`

* data endpoint, instance, props definition and many more

`resources/js/pages/users/column.tsx`

`resources/js/pages/users/index.tsx`

`resources/js/types/datatable.d.ts`

please review `app/Contracts`, `app/Services` and `app/Providers/AppServiceProvider` for params validation, we are using query params when hitting data endpoint and these files were used to configure our request validations.

Some ui may need to be installed, in this starter kit we are using [shadcn](https://ui.shadcn.com/docs)