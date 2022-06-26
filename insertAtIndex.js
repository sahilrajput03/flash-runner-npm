var arr = []
arr[0] = 'Jani'
arr[1] = 'Hege'
arr[2] = 'Stale'
arr[3] = 'Kai Jim'
arr[4] = 'Borge'

console.log(arr) // Jani,Hege,Stale,Kai Jim,Borge
arr.splice(2, 0, 'Lene')
console.log(arr) // Jani,Hege,Lene,Stale,Kai Jim,Borge
