import { header, code, orderList, bold, italic, image, link, inlines, paragraph, blocks, unorderList } from './decoders';
import mkToHtml from './index';

const chai = require('chai');
const fs = require("fs");

describe("Decoders", function(){
  it('Should render markdown to Html correctly', function(){
    chai.assert.equal(mkToHtml.fromfile(__dirname+"/test.md")+"\n",fs.readFileSync(__dirname+"/index.html", "utf-8") )
  })
  describe("Blocks", function(){
    it("should detect several blocks and put them through correct fucntions", function(){
      var string = "# Hola\nComo estas\nYo estoy bien\n\nMe alegro\n1. hola\n2. chau\nhola\n\nchau"
      chai.assert.equal(blocks(string), '<h1>Hola</h1>\n<p>Como estas Yo estoy bien</p>\n<p>Me alegro</p>\n<ol>\n<li>hola</li>\n<li>chau\nhola</li>\n</ol>\n<p>chau</p>\n')
    })
    it('should detect headers', function(){
      var string = "# Hola\n## Chau";
      chai.assert.equal(blocks(string), '<h1>Hola</h1>\n<h2>Chau</h2>\n')
    })
    it('should detect code blocks', function(){
      var string = "```javascript\nvar a = 3\n```";
      chai.assert.equal(blocks(string), '<pre><code class="javascript"><br>var a = 3<br></code></pre>\n')
    })
    describe('Headers', function() {
      it('should return a string with <h1> if has one #', function() {
        var string = '# Hola'
        chai.assert.equal(header(string), '<h1>Hola</h1>')
      })
      it('if there is no space between #hash and the word it is not a Header', function() {
        var string = '#Hola';
        chai.assert.equal(header(string), '#Hola');
      })
      it('should return a string with <h2> if has two #', function() {
        var string = '## Hola'
        chai.assert.equal(header(string), '<h2>Hola</h2>')
      })
      it('if there is no space between #hash and the word it is not a Header', function() {
        var string = '##Hola';
        chai.assert.equal(header(string), '##Hola');
      });
      it('should return a string with <h6> if has six #', function() {
        var string = '###### Hola'
        chai.assert.equal(header(string), '<h6>Hola</h6>')
      })
      it('if there is no space between #hash and the word it is not a Header', function() {
        var string = '######Hola';
        chai.assert.equal(header(string), '######Hola');
      });
      it('if it has more than 7 # it is not a header', function() {
        var string = '####### Hola'
        chai.assert.equal(header(string), '####### Hola')
      });
      it("should not count # in middle of phrases", function(){
        var string = "# hola #chau #";
        chai.assert.equal(header(string), '<h1>hola #chau #</h1>')
      });
      it("should detect inlines", function(){
        var string = "## [Hola](link)"
        chai.assert.equal(header(string), '<h2><a href="link">Hola</a></h2>')
      })
    });

    describe("Order List", function() {
      it("Should create an order list", function() {
        var string = "1. hola\n2. chau\n3. ok"
        chai.assert.equal(orderList(string), '<ol>\n<li>hola</li>\n<li>chau</li>\n<li>ok</li>\n</ol>')
      })
      it("Should create an order list", function() {
        var string = "1. hola"
        chai.assert.equal(orderList(string), '<ol>\n<li>hola</li>\n</ol>')
      })
      it("should detect that if in same line is not a new element", function() {
        var string = "1. hola 2. chau\n3. ok"
        chai.assert.equal(orderList(string), '<ol>\n<li>hola 2. chau</li>\n<li>ok</li>\n</ol>')
      })
      it("should detect that if not valid list element should not create new list item", function() {
        var string = "1. hola\n2. chau\n3- chau \na. hola \n3.hola\n3. ok"
        chai.assert.equal(orderList(string), '<ol>\n<li>hola</li>\n<li>chau\n3- chau \na. hola \n3.hola</li>\n<li>ok</li>\n</ol>')
      })
      it("should detect inlines", function(){
        var string = "1. [Hola](link)"
        chai.assert.equal(orderList(string), '<ol>\n<li><a href="link">Hola</a></li>\n</ol>')
      })
      it("should detect indented order list", function(){
        var string ="1. hola\n2. chau\n 1. hola";
        chai.assert.equal(orderList(string),'<ol>\n<li>hola</li>\n<li>chau\n<ol>\n<li>hola</li>\n</ol>\n</li>\n</ol>')
      })
      it("should detect indented unrder list", function(){
        var string ="1. hola\n2. chau\n - hola";
        chai.assert.equal(orderList(string), '<ol>\n<li>hola</li>\n<li>chau\n<ul>\n<li>hola</li>\n</ul>\n</li>\n</ol>')
      })
    })
    describe("Unorder List", function() {
      it("Should create an unorder list", function() {
        var string = "- hola\n- chau\n- ok"
        chai.assert.equal(unorderList(string), '<ul>\n<li>hola</li>\n<li>chau</li>\n<li>ok</li>\n</ul>')
      })
      it("Should create an unorder list", function() {
        var string = "- hola"
        chai.assert.equal(unorderList(string), '<ul>\n<li>hola</li>\n</ul>')
      })
      it("should detect that if in same line is not a new element", function() {
        var string = "- hola - chau\n- ok"
        chai.assert.equal(unorderList(string), '<ul>\n<li>hola - chau</li>\n<li>ok</li>\n</ul>')
      })
      it("should detect that if not valid list element should not create new list item", function() {
        var string = "- hola\n- chau\n-f chau \n3- hola \n-hola\n- ok"
        chai.assert.equal(unorderList(string), '<ul>\n<li>hola</li>\n<li>chau\n-f chau \n3- hola \n-hola</li>\n<li>ok</li>\n</ul>')
      })
      it("should detect inlines", function(){
        var string = "- [Hola](link)"
        chai.assert.equal(unorderList(string), '<ul>\n<li><a href="link">Hola</a></li>\n</ul>')
      })
      it("should detect indented order list", function(){
        var string ="- hola\n- chau\n 1. hola";
        chai.assert.equal(unorderList(string), '<ul>\n<li>hola</li>\n<li>chau\n<ol>\n<li>hola</li>\n</ol>\n</li>\n</ul>')
      })
      it("should detect indented unorder list", function(){
        var string ="- hola\n- chau\n - hola";
        chai.assert.equal(unorderList(string), '<ul>\n<li>hola</li>\n<li>chau\n<ul>\n<li>hola</li>\n</ul>\n</li>\n</ul>')
      })
    })

    describe("Paragraphs", function(){
      it("should enclose in p tags", function(){
        var string ="hola Guille"
        chai.assert.equal(paragraph(string), '<p>hola Guille</p>')
      })
      it('should detect inlines', function(){
        var string="hola **Guille**"
        chai.assert.equal(paragraph(string), '<p>hola <strong>Guille</strong></p>')
      })
    })

  })
  describe("Inlines", function(){
    it('Should detect italic in phrases', function(){
      var string = "hola *como* estas"
      chai.assert.equal(inlines(string), 'hola <em>como</em> estas')
    })
    it('Should detect bold', function(){
      var string = "hola **como** estas"
      chai.assert.equal(inlines(string), "hola <strong>como</strong> estas")
    })
    it('should detect inner inlines', function(){
      var string = "hola ***como*** estas";
      chai.assert.equal(inlines(string), "hola <strong><em>como</strong></em> estas")
    })
    it("should detect inner inlines", function(){
      var string = "hola *mateo **como*** estas"
      chai.assert.equal(inlines(string), "hola <em>mateo <strong>como</strong></em> estas")
    })
    it("should detect inner inlines", function(){
      var string = "**hola ![alt](img) chau**"
      chai.assert.equal(inlines(string), '<strong>hola <img src="img" alt="alt"> chau</strong>')
    })
    it("should detect inner inlines", function(){
      var string = "**hola [alt](img) chau**"
      chai.assert.equal(inlines(string), '<strong>hola <a href="img">alt</a> chau</strong>')
    })
    it("should detect inner inlines", function(){
      var string = "*hola ```hola``` chau*"
      chai.assert.equal(inlines(string), '<em>hola <code>hola</code> chau</em>')
    })
    it("should detect several inner inlines", function(){
      var string = "**hola como estas [Guille](http://google.com) sos de [Uruguay](link)**"
      chai.assert.equal(inlines(string), '<strong>hola como estas <a href="http://google.com">Guille</a> sos de <a href="link">Uruguay</a></strong>')
    })
    describe('Code', function(){
      it("should return a <pre><code> block when ``` and line space", function(){
        var string = "```\nhola\n```"
        chai.assert.equal(code(string), '<pre><code class=""><br>hola<br></code></pre>')
      })
      it("should return only a code block when no line jumps", function() {
        var string = '``` hola ```'
        chai.assert.equal(code(string), '<code> hola </code>')
      })
      it("should return only a code block when no line jumps", function() {
        var string = '```hola```'
        chai.assert.equal(code(string), '<code>hola</code>')
      })
      it("should add a class javascript when ```javascript and line space ", function(){
        var string = '```javascript\nvar a = 3\n```'
        chai.assert.equal(code(string), '<pre><code class="javascript"><br>var a = 3<br></code></pre>')
      })
      it("should add a class html when ```html and line space", function(){
        var string = '```html\nvar a = 3\n```'
        chai.assert.equal(code(string), '<pre><code class="html"><br>var a = 3<br></code></pre>')
      })
      it("should encode html special characters", function(){
        var string = '```\n<h1>"hola"</h1>\n```'
        chai.assert.equal(code(string), '<pre><code class=""><br>&lt;h1&gt;&quot;hola&quot;&lt;/h1&gt;<br></code></pre>')
      })
      it("should not encode html when ```html and no line space ", function() {
        var string = '```html hola\n```'
        chai.assert.equal(code(string), '<code>html hola<br></code>')
      })
      it("should not encode javascript when ```javascript and no line space ", function() {
        var string = '```javascript hola\n```'
        chai.assert.equal(code(string), '<code>javascript hola<br></code>')
      })
    })
    describe("Italic", function(){
      it("Should add a em tag", function(){
        var string = "hola"
        chai.assert.equal(italic(string), '<em>hola</em>')
      })
    })
    describe("Bold", function(){
        it("Should add a strong tag", function(){
          var string = "hola"
          chai.assert.equal(bold(string), '<strong>hola</strong>');
        })
      })

    describe("Images", function(){
      it("should return an img tag", function(){
        var string = "![alt text](link)"
        chai.assert.equal(image(string), '<img src="link" alt="alt text">')
      })
    })
      describe("link", function(){
        it("should return an anchor tag", function(){
          var string = "[text](link)"
          chai.assert.equal(link(string), '<a href="link">text</a>')
        })
    })
  })
})
