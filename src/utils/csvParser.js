export function parseCSV(data) {  
    const lines = data.split('\n');  
    const result = [];  
    
    const headers = lines[0].split(',');  
    
    for (let i = 1; i < lines.length; i++) {  
      const obj = {};  
      const currentLine = lines[i].split(',');  
      
      // Ensure there are enough columns  
      if (currentLine.length < headers.length) continue;  
  
      headers.forEach((header, index) => {  
        obj[header.trim()] = currentLine[index].trim();  
      });  
      
      result.push({  
        title: obj['Series_Title'],  
        year: parseInt(obj['Released_Year']),  
        rating: parseFloat(obj['IMDB_Rating']),  
        genre: obj['Genre'],  
      });  
    }  
    
    return result.filter(item => !isNaN(item.rating)); // Filter out invalid ratings  
  }