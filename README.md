## Drawer Tool

Upload drawing instructions in text file and Drawer Tool will make a canvas with a set of figures and bucket fill
with provided color.

### Set up

start application on port 3000:
```
npm start
```

run tests:
```
npm test
```

### Instructions

A set of available instructions:

- C w h *Should create a new canvas of width w and height h.*
- L x1 y1 x2 y2 *Should create a new line from (x1,y1) to (x2,y2). Currently only horizontal or vertical lines are supported.*
- R x1 y1 x2 y2 *Should create a new rectangle, whose upper left corner is (x1,y1) and lower right corner is (x2,y2).*
- B x y c *Should fill the entire area connected to (x,y) with "colour" c.*

Example file can be found at: data/input.txt
