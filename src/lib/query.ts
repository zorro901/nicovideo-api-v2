import {
  FilterField,
  NumberRange,
  SearchField,
  SearchParams,
  TargetsField,
  TimeRange,
} from '../types/search';

export function convertFieldsToArray(options: SearchParams): string {
  const newOptions: Record<string, unknown> = {
    ...options,
    _limit: options.limit?.toString(), // number to string
    _offset: options.offset?.toString(), // number to string
    _context: options.context ?? 'apiguide',
    _sort: options.sort ?? {viewCounter:'asc'},
    limit:undefined,
    offset:undefined,
    context:undefined,
    sort:undefined,
  };

  if (options.targets) {
    newOptions.targets = Object.keys(options.targets).filter(key => options.targets?.[key as TargetsField]);
  }

  if (options.fields) {
    newOptions.fields = Object.keys(options.fields).filter(key => options.fields?.[key as keyof SearchField]);
  }

  if (options.jsonFilter) {
    newOptions.jsonFilter = JSON.stringify(options.jsonFilter);
  }

  if (options.sort) {
    newOptions._sort = Object.entries(options.sort)
      .map(([field, direction]) => `${direction === 'desc' ? '-' : '+'}${field}`)
      .join(',');
  }

  const searchParams = Object.fromEntries( // すべてのキーをstring型に変換
    Object.entries(newOptions)
      .filter(([key, value]) => value !== undefined && key !== 'filters') // undefinedでない値だけを処理
      .map(([key, value]) => [key, String(value)]),
  );

  if (options.filters) {
    const queryParams = convertFiltersToUrlString(options.filters);
    return new URLSearchParams(searchParams).toString() + '&' + queryParams
  }

  return new URLSearchParams(searchParams).toString()
}
function formatDate(value: string | Date): string {
  const date = new Date(value);
  return date.toISOString(); // ISO 8601形式に変換
}


function convertFiltersToUrlString(filters: FilterField): string {
  const params: string[] = [];

  Object.entries(filters).forEach(([field, conditions]) => {
    // 'genre.keyword' はフィールド名を変換
    field = field === 'genre.keyword' ? 'genre.keyword' : field;

    if (field === 'startTime' && typeof conditions === 'object') {
      // startTime の from/to の処理
      const { from, to } = conditions as TimeRange;
      if (from) {
        params.push(`filters[startTime][gte]=${formatDate(from)}`);
      }
      if (to) {
        params.push(`filters[startTime][lt]=${formatDate(to)}`);
      }
    } else if (typeof conditions === 'object' && !Array.isArray(conditions)) {
      // NumberRange の処理
      const { min, max } = conditions as NumberRange;
      if (min !== undefined) {
        params.push(`filters[${field}][gte]=${min}`);
      }
      if (max !== undefined) {
        params.push(`filters[${field}][lte]=${max}`);
      }
    } else if (typeof conditions === 'string') {
      // 単一値指定の処理
      params.push(`filters[${field}][0]=${conditions}`);
    }
  });

  return params.join('&');
}
