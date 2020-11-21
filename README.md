<div style="text-align: center;">
<h1>scraping2file</h1>
<p>🌏 Scraping multiple websites and create same formatted file. 🗒</p>
</div>

## Getting Started

Install this package.

```sh
npm i -g scraping2file
```

Create files for execution (Only do the first time)

```sh
scraping2file init
```

Update `config.yml`. This is used for scraping websites, transforming text, and so on. You can set below keys and properties.

```yml
separator: "\t" # separator for each columns.
hostname:
  example.com: # hostname for scraping.
  - selector: "p" # selector is used as `document.querySelector(${selector})`.
    all: true # Can omit it. When setting true, `document.querySelector(${selector})` is changed `document.querySelectorAll(${selector})`.
    callback: !!js/function > # Can omit it. When you want to transform text, set this callback. this callback's argument is `Node.textContent` of each found elements. 
      (str) => str.replace("...", "")
```

Add urls that you scraping websites to `urls.txt`. You separate each urls with line feed.

Finally, execute below command. 

```sh
scraping2file
```

In finishing the execution, scraping2file create a file in `output` directory. 🎉

## License
MIT