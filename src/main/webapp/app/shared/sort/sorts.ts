export default function buildPaginationQueryOpts(paginationQuery) {
  const result: { [key: string]: any } = {};
  if (paginationQuery) {
    Object.keys(paginationQuery).forEach(key => {
      if (key !== 'sort' && key !== 'filter') {
        result[key] = paginationQuery[key];
      }
    });
    if (paginationQuery.sort) {
      const sort: any[] = [];
      for (const idx of Object.keys(paginationQuery.sort)) {
        sort.push(paginationQuery.sort[idx]);
      }
      result['sort'] = sort;
    }
    if (paginationQuery.filter && !paginationQuery.commonQueryId) {
      // 遍历对象
      Object.keys(paginationQuery.filter).forEach(key => {
        result[key] = paginationQuery.filter[key];
      });
    }
  }
  return result;
}
