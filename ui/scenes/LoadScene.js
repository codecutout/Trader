var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'pixi.js', "../Resources", "../../engine/World"], function (require, exports, PIXI, Resources_1, World_1) {
    "use strict";
    var LoadScene = (function (_super) {
        __extends(LoadScene, _super);
        function LoadScene(loaded) {
            var _this = this;
            _super.call(this);
            this.viewWidth = 0;
            this.viewHeight = 0;
            this.minimumLoadingPageShown = 1000;
            this.skipLoadingPageTimeout = 200;
            //some quick loading to show a nice loading screen
            PIXI.loader.add('loadingImage', '/assets/loading.png').load(function (loader, loadedResources) {
                //we will show the page soon, we dont show it immediatly as our loading might
                //be very quick, and we dont want to show the loading page unless we have to
                var pageIsShown = false;
                var showPageTimeout = setTimeout(function () {
                    _this.loadingSprite = new PIXI.Sprite(loadedResources.loadingImage.texture);
                    _this.loadingSprite.anchor = new PIXI.Point(0.5, 0.5);
                    _this.addChild(_this.loadingSprite);
                    _this.resize(_this.viewWidth, _this.viewHeight); //resize to position our sprite
                    pageIsShown = true;
                }, _this.skipLoadingPageTimeout);
                var startTime = new Date().getTime();
                //now we start loading the real content
                PIXI.loader.add('gameState', '/assets/maps/demo.json').load(function (loader, loadedResources) {
                    var resources = new Resources_1.default();
                    resources.world = new World_1.default(loadedResources.gameState.data);
                    //we know now the tilests, so we will load each of hte tilesets
                    var baseDirectory = '/assets/maps/';
                    resources.world.state.tilesets.forEach(function (tileset) {
                        PIXI.loader.add(tileset.name, baseDirectory + tileset.image);
                    });
                    PIXI.loader.load(function (loader, loadedResources) {
                        var endTime = new Date().getTime();
                        var elapsedTime = endTime - startTime;
                        console.debug('Loaded resources in ' + elapsedTime + 'ms', loadedResources);
                        clearTimeout(showPageTimeout);
                        resources.world.state.tilesets.forEach(function (tileset) {
                            resources.tileSets[tileset.name] = loadedResources[tileset.name].texture;
                        });
                        if (pageIsShown) {
                            //if we have started showing the page we have to show it for the minimum time
                            var additionalWait = Math.max(0, _this.minimumLoadingPageShown - elapsedTime);
                            setTimeout(function () {
                                loaded(resources);
                            }, additionalWait);
                        }
                        else {
                            console.debug('resources loaded fast, will not show the loading page');
                            loaded(resources);
                        }
                    });
                });
            });
        }
        LoadScene.prototype.resize = function (width, height) {
            console.debug('Resizing LoadScene', { width: width, height: height });
            this.viewWidth = width;
            this.viewHeight = height;
            if (this.loadingSprite != null) {
                this.loadingSprite.x = this.viewWidth / 2;
                this.loadingSprite.y = this.viewHeight / 2;
            }
        };
        return LoadScene;
    }(PIXI.Container));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LoadScene;
});
//# sourceMappingURL=LoadScene.js.map