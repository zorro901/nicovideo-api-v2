export function convertFieldsToArray(options: SearchParams): Record<string, string> {
  const newOptions: Record<string, unknown> = {
    ...options,
    _limit: options.limit?.toString(), // number to string
    _offset: options.offset?.toString(), // number to string
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

  return Object.fromEntries( // すべてのキーをstring型に変換
    Object.entries(newOptions)
      .filter(([, value]) => value !== undefined) // 値がundefinedでない場合だけ変換
      .map(([key, value]) => [key, String(value)]),
  );
}