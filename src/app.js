var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    orb: null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        // add a "close" icon to exit the progress. it's an autorelease object
        var closeItem = new cc.MenuItemImage(
            res.FullScreen,
            res.FullScreen,
            function () {
                cc.log("Menu is clicked!");

                if (cc.screen.fullScreen()){
                    cc.screen.exitFullScreen();
                }
                else {

                    var targetElement = document.getElementById("gameCanvas");

                    cc.screen.requestFullScreen(targetElement, function () {
                    });
                }

            }, this);
        closeItem.attr({
            scale:0.25,
            x: size.width,
            y: 0,
            anchorX: 1,
            anchorY: 0
        });

        var menu = new cc.Menu(closeItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);

        // add "HelloWorld" splash screen"
        this.sprite = new cc.Sprite(res.Hydro_background);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(this.sprite, 0);

        this.cloud = new cc.Sprite(res.Cloud);
        this.cloud.attr({
            x: 100,
            y: size.height - 100,
            anchorX:.5,
            anchorY:.5,
            scale:.15
        });

        var cloudSprite = this.cloud;

        this.addChild(this.cloud, 0);

        var cloudFinish = function(target){

            cloudMoveFinished();
        };

        var cloudMoveFinished = function(target){
            var height = Math.random() * 150;
            cloudSprite.runAction(
                cc.sequence( new cc.MoveTo(0, cc.p(-50, size.height-50-height)), new cc.MoveTo(10, cc.p(900, size.height-50-height)), cc.callFunc(cloudFinish, cloudSprite) )
            );
        };

        cloudMoveFinished();

        // add orb
        this.orb = new cc.Sprite(res.Orb_png);
        this.orb.attr({
            x: size.width / 4,
            y: size.height / 4,
            anchorX:.5,
            anchorY:.5,
            scale: 0.25
        });
        this.addChild(this.orb, 0);

        var orbSprite = this.orb;

        var listener1 = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            // When "swallow touches" is true, then returning 'true' from the onTouchBegan method will "swallow" the touch event, preventing other listeners from using it.
            swallowTouches: true,
            //onTouchBegan event callback function
            onTouchBegan: function (touch, event) {
                // event.getCurrentTarget() returns the *listener's* sceneGraphPriority node.
                var target = event.getCurrentTarget();

                //Get the position of the current point relative to the button
                var location = touch.getLocation();
                var s = target.getContentSize();
                var deltaX = Math.abs(orbSprite._position.x - location.x);
                var deltaY = Math.abs(orbSprite._position.y - location.y);
                var delta = deltaX + deltaY;

                orbSprite.stopAllActions();
                orbSprite.runAction(new cc.MoveTo(delta / 400, cc.p(location.x, location.y)));

                return false;
            },
            //Trigger when moving touch
            onTouchMoved: function (touch, event) {
                var target = event.getCurrentTarget();

                //Get the position of the current point relative to the button
                var location = touch.getLocation();
                var s = target.getContentSize();
                var deltaX = Math.abs(orbSprite._position.x - location.x);
                var deltaY = Math.abs(orbSprite._position.y - location.y);
                var delta = deltaX + deltaY;

                orbSprite.stopAllActions();
                orbSprite.runAction(new cc.MoveTo(delta / 400, cc.p(location.x, location.y)));

                return false;
            },
            //Process the touch end event
            onTouchEnded: function (touch, event) {
                var target = event.getCurrentTarget();
            }
        });

        cc.eventManager.addListener(listener1, this.sprite);

        orbSprite.runAction(
            cc.sequence(
                cc.rotateTo(2, 0)
            )
        );

        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

