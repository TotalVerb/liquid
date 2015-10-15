.PHONY: static-html
static-html: build/liquid.html build/legacy.html build/dist build/lib build/res

build/liquid.html: build liquid.html
	cp liquid.html build/liquid.html

build/legacy.html: build legacy.html build/dist-legacy
	cp legacy.html build/legacy.html

# some of these polyfills are not needed for the modern version...
build/lib: build lib
	cp -r lib build

build/res: build res
	cp -r res build

build/dist: build src
	babel src --out-dir build/dist --modules amd --whitelist strict,es6.modules,es6.classes,es6.blockScoping,es6.destructuring

build/dist-legacy: build src
	babel src --out-dir build/dist-legacy --modules amd

#build/dist-legacy: build src
#	babel src --out-dir build/dist-legacy --modules amd

build:
	mkdir build

.PHONY: clean
clean:
	rm -r build
