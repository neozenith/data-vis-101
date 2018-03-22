# Data Visualization 101

This repo sets out to achieve a few things:

 - Curate the tidbits of advice about good data visualization over the years
 - Help compare and contrast JS frameworks for the situation of "I just need a graph"
 - Collected my own snippets of boilerplate for data visualisation.

One of the other reasons I am putting this together is that I am working through 
[Interactive Data Visualization for the Web: An Introduction to Designing with D3](https://www.amazon.com.au/Interactive-Data-Visualization-Web-Introduction-ebook/dp/B074JKZ9Z3)
and I like learning by example.

## Getting Started

```
npm install
npm start

# Open in a browser http://localhost:3000/
```

## Dataset

The data set used is the log of odometer readings and dates from everytime I fuelled
up my Nissan Tiida '09 for the entirety of 2017.

## Visual Encoding

<img src="images/VisualEncoding.png" />

This slide was lifted from a key note at Tableau Conference circa 2015.

This image shows the ten most effective ways of visually encoding information as
shown from a research study that flashed up images to candidates. These were
the encodings that were the most effective for the human eye to notice.

_Citation Needed_ 

## Scalable Vector Graphics (SVG)

SVGs are largely the basis for drawing anything on the web and especially when
it is a data driven drawing.

I like the below linked cheat sheet as a reference.

[SVG Cheatsheet](http://www.cheat-sheets.org/own/svg/index.xhtml)

## Mappings and 1000 words

Your data is often abstract and lacking in physical properties.

Yet you are trying to visualise it in a very physical way by drawing it.

Essentially a data visualisation is a _mapping_ between your dataset's _Domain_
and the _Range_ of pixels you need to draw to.

You are mapping properties of your data to any of the visual encoding properties:

 - Length
 - Width
 - Orientation
 - Size
 - Shape
 - Enclosure
 - 2D position
 - Grouping
 - Hue
 - Intensity

Why? Because humans are much better at interpreting visual relationships than
reading text, parsing the grammar of the language and then trying to internally 
visualise that relationship.

And we know what they say a picture is worth...

## Resources

### Books

| Book Cover | Title | Published |
| --- | --- | --- |
| <a href="https://www.amazon.com.au/Interactive-Data-Visualization-Web-Introduction-ebook/dp/B074JKZ9Z3" alt="Interactive Data Visualization for the Web: An Introduction to Designing with D3 2nd Edition, Aug 2017"><img src="https://images-fe.ssl-images-amazon.com/images/I/51HP18fPYML.jpg" height="150px" /></a> | Interactive Data Visualization for the Web: An Introduction to Designing with D3 2nd Edition | Aug 2017 |
| <a href="https://www.amazon.com.au/Data-Visualisation-Handbook-Driven-Design-ebook/dp/B01G2C5VCG" alt="Data Visualisation: A Handbook for Data Driven Design 1st Edition"><img src="https://images-fe.ssl-images-amazon.com/images/I/51ogBxoSoZL.jpg" height="150px" /></a> | Data Visualisation: A Handbook for Data Driven Design 1st Edition | Jun 2016 |

### Online

| Title | Link |
| --- | --- |
| D3 in 5 Days (Email Series) | [https://benclinkinbeard.com/d3in5days/](https://benclinkinbeard.com/d3in5days/) |
