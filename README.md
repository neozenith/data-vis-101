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

# In one terminal run webpack build task which monitors for changes
npm run build:dev

# Run HTTP Server which serves dist/
npm run serve:dev


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

I don't have a citation other than [this blog post by targetprocess](https://www.targetprocess.com/articles/visual-encoding/) which also summarises visual
encodings.

<a href="https://www.targetprocess.com/articles/visual-encoding/">
<img src="images/retinal_data_flat.jpg" alt="grid marking visual encoding propretires" />
</a>
<a href="http://www.workwithcolor.com/blue-color-hue-range-01.htm">
<img src="images/cona-hue-ranges-map-02.png" alt="Distinct ranges on a hue colour wheel">
</a>

<table>
	<tr>
		<td>
			<div style="bgcolor: hsl(0,100%,100%)">nbsp;</div>
		</td>
		<td>
			<div style="bgcolor: hsl(0,100%,75%)">nbsp;</div>
		</td>
		<td>
			<div style="bgcolor: hsl(0,100%,50%)">nbsp;</div>
		</td>
		<td>
			<div style="bgcolor: hsl(0,100%,25%)">nbsp;</div>
		</td>
		<td>
			<div style="bgcolor: hsl(0,100%,0%)">nbsp;</div>
		</td>
	</tr>
	<tr>
		<td>
			<div style="bgcolor: hsl(0,75%,100%)">nbsp;</div>
		</td>
		<td>
			<div style="bgcolor: hsl(0,75%,75%)">nbsp;</div>
		</td>
		<td>
			<div style="bgcolor: hsl(0,75%,50%)">nbsp;</div>
		</td>
		<td>
			<div style="bgcolor: hsl(0,75%,25%)">nbsp;</div>
		</td>
		<td>
			<div style="bgcolor: hsl(0,75%,0%)">nbsp;</div>
		</td>
	</tr>
	<tr>
		<td>
			<div style="bgcolor: hsl(0,50%,100%)">nbsp;</div>
		</td>
		<td>
			<div style="bgcolor: hsl(0,50%,75%)">nbsp;</div>
		</td>
		<td>
			<div style="bgcolor: hsl(0,50%,50%)">nbsp;</div>
		</td>
		<td>
			<div style="bgcolor: hsl(0,50%,25%)">nbsp;</div>
		</td>
		<td>
			<div style="bgcolor: hsl(0,50%,0%)">nbsp;</div>
		</td>
	</tr>
	<tr>
		<td>
			<div style="bgcolor: hsl(0,25%,100%)">nbsp;</div>
		</td>
		<td>
			<div style="bgcolor: hsl(0,25%,75%)">nbsp;</div>
		</td>
		<td>
			<div style="bgcolor: hsl(0,25%,50%)">nbsp;</div>
		</td>
		<td>
			<div style="bgcolor: hsl(0,25%,25%)">nbsp;</div>
		</td>
		<td>
			<div style="bgcolor: hsl(0,25%,0%)">nbsp;</div>
		</td>
	</tr>
	<tr>
		<td>
			<div style="bgcolor: hsl(0,0%,100%)">nbsp;</div>
		</td>
		<td>
			<div style="bgcolor: hsl(0,0%,75%)">nbsp;</div>
		</td>
		<td>
			<div style="bgcolor: hsl(0,0%,50%)">nbsp;</div>
		</td>
		<td>
			<div style="bgcolor: hsl(0,0%,25%)">nbsp;</div>
		</td>
		<td>
			<div style="bgcolor: hsl(0,0%,0%)">nbsp;</div>
		</td>
	</tr>
</table>

## Mental Bandwidth

[Thinking Fast and Slow](https://www.amazon.com/Thinking-Fast-Slow-Daniel-Kahneman-ebook/dp/B005MJFA2W)
is a book by nobel prize winning experimental psychologist Daniel Kahneman that explains
the concept of mental bandwidth.

He devised an experiment, where people were shown a sequence of four digits. They
had to then on a 60bpm metronome count read out each digit and then wait two beats
and then add 1 (or 3) to each digit on each subsequent beat.

This task demonstrated that around 3-5 pieces of information is the most an average 
person can consume at any given time.

This is important when designing data visualisations to keep the number of pieces
of information to 3-5 before the user interacts, signalling they are ready for more 
information with hover, click or the multitude of touch gestures.

He also goes on to describe the ways in which _psychopathic charm_ are used to
mentally hijack you by using, repeated, empathetic phrases with lots of long words.
It is difficult for you to juggle all those words and distinguish truth.

Similarly, visualisation bypasses the need to interpret words and grammar to 
extract the relationships. Sometimes visualisations are more appropriate as they 
avoid the extra mental effort spoken or written communication requires to digest. 


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

## From scratch

```
npm init

# TODO: Set these up properly
npm install --save-dev eslint prettier

# Tools to run a basic nodejs webserver
# Tools to build front end static assets
npm install --save-dev webpack webpack-cli nodemon

# Tools for a basic web server
npm install http-server

# d3 v5.x
npm install d3

./node_modules/.bin/webpack-cli init

```


## Resources

### Books

| Book Cover | Title | Published |
| --- | --- | --- |
| <a href="https://www.amazon.com.au/Interactive-Data-Visualization-Web-Introduction-ebook/dp/B074JKZ9Z3" alt="Interactive Data Visualization for the Web: An Introduction to Designing with D3 2nd Edition, Aug 2017"><img src="https://images-fe.ssl-images-amazon.com/images/I/51HP18fPYML.jpg" height="150px" /></a> | Interactive Data Visualization for the Web: An Introduction to Designing with D3 2nd Edition | Aug 2017 |
| <a href="https://www.amazon.com.au/Data-Visualisation-Handbook-Driven-Design-ebook/dp/B01G2C5VCG" alt="Data Visualisation: A Handbook for Data Driven Design 1st Edition"><img src="https://images-fe.ssl-images-amazon.com/images/I/51ogBxoSoZL.jpg" height="150px" /></a> | Data Visualisation: A Handbook for Data Driven Design 1st Edition | Jun 2016 |
| <a href="https://www.amazon.com/Thinking-Fast-Slow-Daniel-Kahneman-ebook/dp/B005MJFA2W" alt="Thinking, Fast and Slow - Daniel Kahneman"><img src="https://images-na.ssl-images-amazon.com/images/I/41Gl2kqMlCL._SX322_BO1,204,203,200_.jpg" height="150px" /></a> | Thinking, Fast and Slow - Daniel Kahneman | Nov 2011|

### Online

| Title | Link |
| --- | --- |
| D3 in 5 Days (Email Series) | [https://benclinkinbeard.com/d3in5days/](https://benclinkinbeard.com/d3in5days/) |
