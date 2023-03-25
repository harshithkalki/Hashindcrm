import _ from 'lodash';

export function convertToCSV(
  objArray: Record<string | number, string | undefined | number>[] | string,
  headers: Record<string | number, string>
) {
  const array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  let str = '';

  let line = '';

  for (const index in array[0]) {
    if (line != '') line += ',';

    line += _.get(headers, index, '');
  }

  str += line + '\r\n';

  for (let i = 1; i < array.length; i++) {
    let line = '';
    for (const index in array[i]) {
      if (line != '') line += ',';

      line += _.get(array[i], index, '');
    }

    str += line + '\r\n';
  }

  return str;
}

export function exportCSVFile(
  headers: Record<string | number, string>,
  items: Record<string | number, string | undefined | number>[],
  fileTitle: string
) {
  const jsonObject = JSON.stringify(items);

  const csv = convertToCSV(jsonObject, headers);

  const exportedFilenmae = fileTitle + '.csv' || 'export.csv';

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', exportedFilenmae);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
