

// Needs to take an array of marble strings and return an int.
function hashStringArrayToInt(stringArray, tableSize) {
    let hash = 17;
    for (let j = 0; j < stringArray.length; j++) {
        for (let i = 0; i < stringArray[j].length; i++) {
            hash = (13 * hash * stringArray[j].charCodeAt(i)) % tableSize;
          }
    }
    return hash;
  }
  
  class HashTable {
    table = new Array(3333);
    numItems = 0;

    resize = () => {
      const newTable = new Array(this.table.length * 2);
      this.table.forEach(item => {
        if (item) {
          item.forEach(([key, value]) => {
            const idx = hashStringToInt(key, newTable.length);
            if (newTable[idx]) {
              newTable[idx].push([key, value]);
            } else {
              newTable[idx] = [[key, value]];
            }
          });
        }
      });
      this.table = newTable;
    };
  
    setItem = (key, value) => {
      this.numItems++;
      const loadFactor = this.numItems / this.table.length;
      if (loadFactor > 0.8) {
        // resize
        this.resize();
      }
      const idx = hashStringArrayToInt(key, this.table.length);
      if (this.table[idx]) {
        this.table[idx].push([key, value]);
      } else {
        this.table[idx] = [[key, value]];
      }
    };
  
    getItem = key => {
      const idx = hashStringArrayToInt(key, this.table.length);
      if (!this.table[idx]) {
        return null;
      }
      // O(n)
      return this.table[idx].find(x => x[0] === key)[1];
    };
  }

