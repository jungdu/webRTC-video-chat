export function pushUniqueItem<T>(arr: T[], item: T){
  if(arr.findIndex(itemInArr => itemInArr === item) === -1){
    return [...arr, item];
  }
  return arr;
}