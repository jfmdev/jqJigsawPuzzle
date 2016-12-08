/*
 * «Copyright 2012 JFMDev»
 *
 *  This file is part of jqJigsawPuzzle.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * Declare the namespace for the library.
 */
jqJigsawPuzzle = new Object();

/**
 * The array 'pieceSizes' defines the logical and the real sizes of the three sizes of pieces (small, normal and big).
 */
jqJigsawPuzzle.pieceSizes = {
    small : {
        logical: 25,
        real: 43
    },
    normal : {
        logical: 50, 
        real: 86
    },
    big : {
        logical: 100, 
        real: 170
    }
};

/**
 * Creates an array which defines the type of each piece of the puzzle
 * (the type of a piece defines which shape is going to have).
 *
 * The type of the pieces are defined by binary numbers of four digits: 'dcba'
 * where 'a' defines the left side, 'b' the bottom side, 'c' the right side and
 * 'd' the upped side.
 *
 * @param {int} rows The number of rows of the puzzle.
 * @param {int} columns The number of columns of the puzzle.
 * @return {Array} An array with the type of each piece.
 */
jqJigsawPuzzle.randomPieceTypes = function(rows, columns) {
    var res = new Array();
    
    // Format used for represent a piece type as a binary number of four digits (dcba)
    // ----- d -----
    // c --------- a
    // ----- b -----
  
    // Define diagonal pieces.
    for(var i=0; i<rows; i++)
        {
        res[i] = new Array();
        for(var j=0; j<columns; j++)
            {
            if( (i+j)%2 == 0)
                {
                // Generate a random number between 0 and 15 (0000 and 1111).
                var rand = Math.floor(Math.random()*16); 

                // Verify if the piece is in a border.
                if(i == 0) { rand = rand | 8; }            // Is in the first row, set 'd' to 1.
                if(i == rows-1) { rand = rand | 2; }       // Is in the last row, set 'b' to 1.
                if(j == 0) { rand = rand | 4; }            // Is in the first column, set 'c' to 1.
                if(j == columns-1) { rand = rand | 1; }    // Is in the last column, set 'a' to 1.

                // Save value.
                res[i][j] = rand;
                }
            }
        }

    // Define the other pieces.
    for(i=0; i<rows; i++)
    for(j=0; j<columns; j++)
        {
        if( (i+j)%2 == 1)
            {
            var det = 0;
		
            if(i != 0) { det = det | (res[i-1][j] & 2)<<2; }           // d = !b from the piece up.
            if(i != rows-1) { det = det | (res[i+1][j] & 8)>>2; }      // b = !d from the piece down.
            if(j != 0) { det = det | (res[i][j-1] & 1)<<2; }           // c = !a from the piece left.
            if(j != columns-1) { det = det | (res[i][j+1] & 4)>>2; }   // a = !c from the piece right.

            res[i][j] = 15 - det;
            }
        }

    // Convert binary number into strings.
    for(i=0; i<rows; i++)
    for(j=0; j<columns; j++)
        {
        var value = '';
        value += ((res[i][j] & 8) != 0)? '1' : '0';
        value += ((res[i][j] & 4) != 0)? '1' : '0';
        value += ((res[i][j] & 2) != 0)? '1' : '0';
        value += ((res[i][j] & 1) != 0)? '1' : '0';
        res[i][j] = value;
        }

    return res;
}

/**
 * Shuffle the pieces of a puzzle.
 * 
 * The parameter 'options' allows to extend the area, beyong the area of the 
 * puzzle container, in which the pieces can be put when shuffling.
 *
 * @param {string} containerSelector The jQuery selector of the puzzle's container.
 * @param {object} options An associative array with the values 'rightLimit', 'leftLimit', 'topLimit' and 'bottomLimit'.
 */
jqJigsawPuzzle.shufflePieces = function(containerSelector, options) {
    // Process parameters.
    var divPuzzle = jQuery(containerSelector).find('div.puzzle');
    var rightLimit = (options != null && !isNaN(options.rightLimit))? options.rightLimit : 0;
    var leftLimit = (options != null && !isNaN(options.leftLimit))? options.leftLimit : 0;
    var topLimit = (options != null && !isNaN(options.topLimit))? options.topLimit : 0;
    var bottomLimit = (options != null && !isNaN(options.bottomLimit))? options.bottomLimit : 0;
    var puzzleWidth = divPuzzle.width() + leftLimit + rightLimit;
    var puzzleHeight = divPuzzle.height() + topLimit + bottomLimit;
 
    // Move the pieces.
    jQuery(containerSelector).find('div.piece').each(function(index, piece) {
        var pieceWidth = jQuery(this).width();
        var pieceHeight = jQuery(this).height();
        
        jQuery(this).css('left', Math.floor(Math.random()*(puzzleWidth - pieceWidth)) - leftLimit);
        jQuery(this).css('top', Math.floor(Math.random()*(puzzleHeight - pieceHeight)) - topLimit);
    });
}

/**
 * Loads an image and creates a puzzle with it.
 *
 * @param {string} containerSelector The jQuery selector of the element in which to put the image.
 * @param {string} imageUrl The image's URL.
 * @param {object} options An associative array with the values 'piecesSize', 'borderWidth' and 'shuffle' (which is an associative arrary with the values 'rightLimit', 'leftLimit', 'topLimit' and 'bottomLimit').
 */
jqJigsawPuzzle.createPuzzleFromURL = function(containerSelector, imageUrl, options) {
    // Add image to the container.
    var imgId = 'img_' + new Date().getTime();
    jQuery(containerSelector).append('<img src="'+imageUrl+'" id="'+imgId+'" alt=""/>');

    // Create puzzle from the image.
    jqJigsawPuzzle.createPuzzleFromImage("#" + imgId, options);
};

/**
 * Creates a puzzle from an image already defined in the page.
 *
 * @param {string} imageSelector The jQuery selector of the image used for the puzzle.
 * @param {object} options An associative array with the values 'piecesSize', 'borderWidth' and 'shuffle' (which is an associative arrary with the values 'rightLimit', 'leftLimit', 'topLimit' and 'bottomLimit').
 */
jqJigsawPuzzle.createPuzzleFromImage = function(imageSelector, options) {
    // Verify if the image exists.
    if(jQuery(imageSelector).size() > 0) {   
        // Verify if the image has been fully loaded.
        if(jQuery(imageSelector).width() > 0 && jQuery(imageSelector).height() > 0) {
            // Transform image to puzzle.
            jqJigsawPuzzle.imageToPuzzle(imageSelector, options);
        } else {
            // Declare variable for check if the puzzle has been created.
            var puzzleCreated = false;

            // Add event for when the puzzle is created.
            jQuery(imageSelector).load(function() {
                if(!puzzleCreated) {
                    puzzleCreated = true;
                    jqJigsawPuzzle.imageToPuzzle(imageSelector, options);
                }
            });
            
            // Check, just in case, if the image has been loaded.
            if(jQuery(imageSelector).width() > 0 && jQuery(imageSelector).height() > 0) {
                puzzleCreated = true;
                jqJigsawPuzzle.imageToPuzzle(imageSelector, options);
            }            
        }
    }
}

/**
 * Creates a puzzle from an image already loaded (fully rendered) in the page.
 *
 * @param {string} imageSelector The jQuery selector of the image used for the puzzle.
 * @param {object} options An associative array with the values 'piecesSize', 'borderWidth' and 'shuffle' (which is an associative arrary with the values 'rightLimit', 'leftLimit', 'topLimit' and 'bottomLimit').
 */
jqJigsawPuzzle.imageToPuzzle = function(imageSelector, options) {
    // Process parameters.
    var img = jQuery(imageSelector);
    if(img.size() > 1) img = img.find(':first');   
    var piecesSize = (options != null && options.piecesSize != null)? options.piecesSize : 'normal';
    if(piecesSize != 'normal' && piecesSize != 'small' && piecesSize != 'big') piecesSize = 'normal';
    var borderWidth = (options != null && !isNaN(options.borderWidth))? parseInt(options.borderWidth, 10) : 5;
    var puzzleId = 'puzzle_' + new Date().getTime();

    // Draw the puzzle frame over the image.
    var imgWidth = img.width();
    var imgHeight = img.height();
    var imgPosX = img.position().left;
    var imgPosY = img.position().top;
    var imgSrc = img.attr("src");

    var html = '<div class="jigsaw" id="'+puzzleId+'" style="left:'+(imgPosX-borderWidth)+'px; top:'+(imgPosY-borderWidth)+'px; width:'+(imgWidth)+'px; min-height:'+(imgHeight)+'px; border-width:'+borderWidth+'px;">' +
                   '<div class="puzzle" style="width:'+imgWidth+'px; height:'+imgHeight+'px; background-image:url(\''+imgSrc+'\');"></div>' +
                   '<div class="menu" style="width:'+(imgWidth)+'px;">' + 
                        '<table class="menu"><tr>' + 
                            '<td><a href="#" class="button" id="'+puzzleId+'_shuffle" title="Shuffle">Shuffle</a></td>' + 
                            '<td>Movements: <span class="movement_compter" id="'+puzzleId+'_movements"></span></td>' + 
                            '<td>Time: <span class="time_compter" id="'+puzzleId+'_time"></span></td>' + 
                        '</tr></table>' + 
                   '</div>' +
               '</div>';
    jQuery('body').append(html);
    var piecesContainer = jQuery("#" + puzzleId);

    // Get the size of the pieces.
    var logicalSize = jqJigsawPuzzle.pieceSizes[piecesSize].logical;
    var realSize = jqJigsawPuzzle.pieceSizes[piecesSize].real;
    var offset = (realSize - logicalSize)/2;
        
    // Calculate the number of pieces.
    var columns = parseInt(imgWidth / logicalSize);
    if(imgWidth % logicalSize != 0) columns++;
    var rows = parseInt(imgHeight / logicalSize);
    if(imgHeight % logicalSize != 0) rows++;
    
    // Save the number of pieces and set the counter which checks how many pieces has been put in the right location.
    piecesContainer.data('pieces-number', columns*rows);
    piecesContainer.data('pieces-located', 0);
    
    // Calculate piece types.
    var pieceTypes = jqJigsawPuzzle.randomPieceTypes(rows, columns);

    // Bind z-index value to container and set the z-index of the menu.
    piecesContainer.data('last-z-index', rows*columns);
    piecesContainer.find('div.menu').css("z-index", rows*columns);

    // Create pieces.
    for(var r=0; r<rows; r++) {
        for(var c=0; c<columns; c++) {
            // Calculate parameter.
            var posX = -offset + c*logicalSize;
            var posY = -offset + r*logicalSize;
            var backgroundPosX = offset - c*logicalSize;
            var backgroundPosY = offset - r*logicalSize;
            var id = puzzleId + '_piece_'+r+'x'+c;
            var clase = 'piece_' + pieceTypes[r][c];

            // Add html element.
            html = '<div id="' + id + '" ' +
                            'class="piece ' + piecesSize + ' ' + clase + '" ' +
                            'data-posX="' + posX + '" ' +
                            'data-posY="' + posY + '" ' +
                            'style="background-image: url(\''+imgSrc+'\');' + 
                                   'background-position: ' + backgroundPosX + 'px ' + backgroundPosY + 'px;' +
                                   'left: ' + posX + 'px; ' +
                                   'top: ' + posY + 'px; ' +
                                   'width: ' + realSize + 'px; ' +
                                   'height: ' + realSize + 'px;">' +
                        '</div>';
            piecesContainer.append(html);

            // Set initial z-index.
            jQuery("#" + id).css("z-index", rows*columns-1);

            // Add draggable behavior.
            jQuery("#" + id).draggable({
                start: function(event, ui) {
                    // Verify if the piece is not already positioned.
                    var posX = parseInt(jQuery(this).attr('data-posX'), 10);
                    var posY = parseInt(jQuery(this).attr('data-posY'), 10);
                    if(posX == ui.position.left && posY == ui.position.top)
                        { return false; }
                    
                    // Start timer counter.
                    jqJigsawPuzzle.startTimerCounter(piecesContainer);
                    
                    // Verify if the cursor is inside the 'logical' area, besides being insided the 'real' area.
                    //var relativeCursorPosX = event.pageX - ui.position.left - piecesContainer.position().left;
                    //var relativeCursorPosY = event.pageY - ui.position.top - piecesContainer.position().top;                   
                    //if( relativeCursorPosY>(logicalSize+offset) || relativeCursorPosY<offset || 
                    //    relativeCursorPosX>(logicalSize+offset) || relativeCursorPosX<offset)
                    //    { return false; }
               
                    // Change z-index in order to put it on top of all the other pieces.
                    var zIndex = parseInt(piecesContainer.data('last-z-index'), 10);
                    jQuery(this).css("z-index", zIndex);
                    piecesContainer.data('last-z-index', zIndex+1);
                    
                    return true;
                },
                stop: function(event, ui) {
                    // Verify if the piece has been droped close to his correct position.
                    var posX = parseInt(jQuery(this).attr('data-posX'), 10);
                    var posY = parseInt(jQuery(this).attr('data-posY'), 10);
                    var difX = ui.position.left - posX;
                    var difY = ui.position.top - posY;
                    if( difX > -offset && difX < offset && difY > -offset && difY < offset ) {
                        //Put it in this position and remove the draggable behavior
                        jQuery(this).css('left', posX);
                        jQuery(this).css('top', posY);
                        jQuery(this).css("z-index", rows*columns-2);

                        // Reproduce sound.
                        if(jqJigsawPuzzle.pieceSound != null) jqJigsawPuzzle.pieceSound.play();

                        // Change the color of the border for a quarter of a second.
                        piecesContainer.addClass('highlight');
                        setTimeout(function() { piecesContainer.removeClass('highlight'); }, 250);
                        
                        // Increase the number of pieces located.
                        var piecesLocated = parseInt(piecesContainer.data('pieces-located'), 10);
                        piecesContainer.data('pieces-located', piecesLocated + 1);
                        
                        // Verify if the puzzle has been solved.
                        if(piecesLocated+1 >= parseInt(piecesContainer.data('pieces-number'), 10)) {
                            piecesContainer.addClass('resolved');
                            jqJigsawPuzzle.stopTimerCounter(piecesContainer);
                            if(jqJigsawPuzzle.finishSound != null) jqJigsawPuzzle.finishSound.play();
                        }
                    }

                    // Increase compter.
                    jqJigsawPuzzle.increaseMovementCounter(piecesContainer);
                }
            });
        }
    }

    // Shuffle pieces and initialize time and movement compters.
    jqJigsawPuzzle.shufflePieces(piecesContainer, options!=null? options.shuffle : null);
    jqJigsawPuzzle.resetCounters(piecesContainer);
    
    // Assign behavior to shuffle button.
    jQuery("#" + puzzleId + "_shuffle").click(function() {
        piecesContainer.data('pieces-located', 0);
        piecesContainer.removeClass('highlight');
        piecesContainer.removeClass('resolved');
        jqJigsawPuzzle.shufflePieces(piecesContainer, options!=null? options.shuffle : null);
        jqJigsawPuzzle.resetCounters(piecesContainer);
    });
};

/**
 * Resets the movement compter and the timer.
 *
 * @param {object} piecesContainer A jQuery selector, which can be an string or a jQuery object, of the element which contains the puzzle.
 */
jqJigsawPuzzle.resetCounters = function(piecesContainer) {
    // Resets timer counter.
    jqJigsawPuzzle.stopTimerCounter(piecesContainer);
    jqJigsawPuzzle.setTimerCounter(piecesContainer, 0);
    
    // Resets movement counter.
    jQuery(piecesContainer).find(".movement_compter").html('0');
};

/**
 * Increase in one the movement compter.
 *
 * @param {object} piecesContainer A jQuery selector, which can be an string or a jQuery object, of the element which contains the puzzle.
 */
jqJigsawPuzzle.increaseMovementCounter = function(piecesContainer) { 
    var count = parseInt(jQuery(piecesContainer).find(".movement_compter").html(), 10);
    jQuery(piecesContainer).find(".movement_compter").html((count+1) + '');
};

/**
 * Starts the timer counter.
 *
 * @param {object} piecesContainer A jQuery selector, which can be an string or a jQuery object, of the element which contains the puzzle.
 */
jqJigsawPuzzle.startTimerCounter = function(piecesContainer) { 
    // Verify if the timer has not already been started.
    if(jQuery(piecesContainer).data('timer-status') != 'running') {
        // Change status and set initial time.
        jQuery(piecesContainer).data('timer-status', 'running');
        jQuery(piecesContainer).data('timer-value', new Date().getTime());
        
        // Refresh timer each second.
        var interval = setInterval(function(){
            jqJigsawPuzzle.refreshTimerCounter(piecesContainer);
        }, 1000);
        jQuery(piecesContainer).data('timer-interval', interval);
    }
};

/**
 * Stops the timer counter.
 *
 * @param {object} piecesContainer A jQuery selector, which can be an string or a jQuery object, of the element which contains the puzzle.
 */
jqJigsawPuzzle.stopTimerCounter = function(piecesContainer) { 
    // Verify if the timer has not already been stoped.
    if(jQuery(piecesContainer).data('timer-status') != 'stopped') {
        jQuery(piecesContainer).data('timer-status', 'stopped');
        clearInterval(jQuery(piecesContainer).data('timer-interval'));
    }
};

/**
 * Refresh the timer counter.
 *
 * @param {object} piecesContainer A jQuery selector, which can be an string or a jQuery object, of the element which contains the puzzle.
 */
jqJigsawPuzzle.refreshTimerCounter = function(piecesContainer) { 
    var currentTime = new Date().getTime();
    jqJigsawPuzzle.setTimerCounter(piecesContainer, currentTime - jQuery(piecesContainer).data('timer-value'));
};

/**
 * Sets the visible value of the timer counter.
 *
 * @param {object} piecesContainer A jQuery selector, which can be an string or a jQuery object, of the element which contains the puzzle.
 * @param {int} time The time passed in milliseconds
 */
jqJigsawPuzzle.setTimerCounter = function(piecesContainer, time) {    
    time = (time>0)? time/1000 : 0;
    var seconds = parseInt(time%60, 10);
    var minutes = parseInt((time/60)%60, 10);
    var hours = parseInt(time/3600, 10);
    if(seconds < 10) seconds = '0' + seconds;
    if(minutes < 10) minutes = '0' + minutes;
    if(hours < 10) hours = '0' + hours;
    jQuery(piecesContainer).find(".time_compter").html(hours + ':' + minutes + ':' + seconds);
};

/**
 * Define the sound object, created by SoundManager, used for reproduce a sound when a piece is put.
 */
jqJigsawPuzzle.pieceSound = null;

/**
 * Define the sound object, created by SoundManager, used for reproduce a sound when the puzzle is solve.
 */
jqJigsawPuzzle.finishSound = null;

/**
 * Configure SoundManager.
 */ 
soundManager.setup({
    url: 'swf/',
    flashVersion: 9,
    useFlashBlock: false,
    onready: function() {
        // Initialize sounds.
        jqJigsawPuzzle.pieceSound = soundManager.createSound({
            id: 'piece',
            url: 'mp3/tom1.mp3'
            //, onload: function() {}
        });
        jqJigsawPuzzle.finishSound = soundManager.createSound({
            id: 'finish',
            url: 'mp3/large_crowd_applause.mp3'
            //, onload: function() {}
        });
    },
    ontimeout: function() {
        // The library has not successfully initialized.
    }
});