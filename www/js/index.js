/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        setupWorld();

        var canvasElm = jQuery('#canvas');
        handleResize();
        jQuery(window).resize(handleResize);
        disableSelection(canvasElm.get(0));

        canvasElm.svg({
            'onLoad': function () {
                ctx = canvasElm.svg('get');
                // ctx = {'svg':svgContext, 'buffers' : []};
                // initBuffers(svgContext);

                function clickPoint(event) {
                    return {
                        x: event.pageX || (event.clientX +
                            (document.documentElement.scrollLeft || document.body.scrollLeft)),
                        y: event.pageY || (event.clientY +
                            (document.documentElement.scrollTop || document.body.scrollTop))
                    };
                };

                jQuery('#canvas').on('tap', function (e) {
                    console.log('tap');
                    var position = clickPoint(e);
                    if (Math.random() < 0.5)
                        demos.top.createBall(world, position.x - canvasLeft, position.y - canvasTop);
                    else
                        createBox(world, position.x - canvasLeft, position.y - canvasTop, 10, 10, false);

                    e.stopPropagation();
                    return false;
                }).dblclick(function (e) {
                    e.stopPropagation();
                });

                jQuery(window).on('swipe', function (e) {
                    console.log('swipe');
                    missedFrames = 11;
                    ctx.clear();
                    // initBuffers(svgContext);
                    setupPrevWorld();
                    return false;
                });

                step();
            }
        });
    }
};

app.initialize();