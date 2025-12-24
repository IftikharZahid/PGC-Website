import sys

# Read the file
with open(r'c:\Users\Dell\Desktop\PGC Website\client\src\pages\Home.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find and replace the section (lines 104-112, 0-indexed: 103-111)
new_content = []
for i, line in enumerate(lines):
    if i == 103:  # Line 104 in 1-indexed
        # Add the new map content with conditional Link
        new_content.append(line)  # Keep the RevealOnScroll line
        new_content.append('                    {idx === 0 ? (\r\n')
        new_content.append('                      <Link to="/seminars" className="block">\r\n')
        new_content.append('                        <div className="group cursor-pointer">\r\n')
        new_content.append('                          <div className="overflow-hidden mb-4 rounded-lg">\r\n')
        new_content.append('                             <img src={item.img} alt={item.title} className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-lg"/>\r\n')
        new_content.append('                          </div>\r\n')
        new_content.append('                          <div className="text-primary-700 dark:text-primary-400 text-xs font-bold uppercase tracking-widest mb-2">{item.cat}</div>\r\n')
        new_content.append('                          <h3 className="text-2xl font-serif font-bold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors leading-tight">{item.title}</h3>\r\n')
        new_content.append('                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{item.desc}</p>\r\n')
        new_content.append('                        </div>\r\n')
        new_content.append('                      </Link>\r\n')
        new_content.append('                    ) : (\r\n')
        new_content.append('                      <div className="group cursor-pointer">\r\n')
        new_content.append('                        <div className="overflow-hidden mb-4 rounded-lg">\r\n')
        new_content.append('                           <img src={item.img} alt={item.title} className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-lg"/>\r\n')
        new_content.append('                        </div>\r\n')
        new_content.append('                        <div className="text-primary-700 dark:text-primary-400 text-xs font-bold uppercase tracking-widest mb-2">{item.cat}</div>\r\n')
        new_content.append('                        <h3 className="text-2xl font-serif font-bold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors leading-tight">{item.title}</h3>\r\n')
        new_content.append('                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{item.desc}</p>\r\n')
        new_content.append('                      </div>\r\n')
        new_content.append('                    )}\r\n')
        # Skip the original lines 105-112 (indices 104-111)
    elif i < 104 or i > 111:
        new_content.append(line)

# Write back
with open(r'c:\Users\Dell\Desktop\PGC Website\client\src\pages\Home.jsx', 'w', encoding='utf-8', newline='') as f:
    f.writelines(new_content)

print("File updated successfully!")
