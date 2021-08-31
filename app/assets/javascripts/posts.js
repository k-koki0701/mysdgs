document.addEventListener('turbolinks:load', function(){
  var mySwiper = new Swiper('.swiper-container', {
    // Optional parameters
    loop: false,

    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
      dynamicBullets: true,
		  dynamicMainBullets: 1,
    },

    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  })
});

$(document).on('turbolinks:load', function(){
  $(function(){

    //プレビューのhtmlを定義
    function buildHTML(count) {
      var html = `<div class="preview-box" id="preview-box__${count}">
                    <div class="upper-box">
                      <img src="" alt="preview">
                    </div>
                    <div class="lower-box">
                      <div class="delete-box" id="delete_btn_${count}">
                        <span>削除</span>
                      </div>
                    </div>
                  </div>`
      return html;
    }

    // 投稿編集時
    //posts/:i/editページへリンクした際のアクション=======================================
    if (window.location.href.match(/\/posts\/\d+\/edit/)){
      //登録済み画像のプレビュー表示欄の要素を取得する
      var prevContent = $('.label-content').prev();
      labelWidth = (620 - $(prevContent).css('width').replace(/[^0-9]/g, ''));
      $('.label-content').css('width', labelWidth);
      //プレビューにidを追加
      $('.preview-box').each(function(index, box){
        $(box).attr('id', `preview-box__${index}`);
      })
      //削除ボタンにidを追加
      $('.delete-box').each(function(index, box){
        $(box).attr('id', `delete_btn_${index}`);
      })
      var count = $('.preview-box').length;
      //プレビューが5あるときは、投稿ボックスを消しておく
      if (count == 5) {
        $('.label-content').hide();
      }
    }
    //=============================================================================

    // ラベルのwidth操作
    function setLabel() {
      //プレビューボックスのwidthを取得し、maxから引くことでラベルのwidthを決定
      var prevContent = $('.label-content').prev();
      labelWidth = (620 - $(prevContent).css('width').replace(/[^0-9]/g, ''));
      $('.label-content').css('width', labelWidth);
    }

    // プレビューの追加
    $(document).on('change', '.hidden-field', function() {
      setLabel();
      //hidden-fieldのidの数値のみ取得
      var id = $(this).attr('id').replace(/[^0-9]/g, '');
      //labelボックスのidとforを更新
      $('.label-box').attr({id: `label-box--${id}`,for: `post_pictures_attributes_${id}_image`});
      //選択したfileのオブジェクトを取得
      var file = this.files[0];
      var reader = new FileReader();
      //readAsDataURLで指定したFileオブジェクトを読み込む
      reader.readAsDataURL(file);
      //読み込み時に発火するイベント
      reader.onload = function() {
        var image = this.result;
        //プレビューが元々なかった場合はhtmlを追加
        if ($(`#preview-box__${id}`).length == 0) {
          var count = $('.preview-box').length;
          var html = buildHTML(id);
          //ラベルの直前のプレビュー群にプレビューを追加
          var prevContent = $('.label-content').prev();
          $(prevContent).append(html);
        }
        //イメージを追加
        $(`#preview-box__${id} img`).attr('src', `${image}`);
        var count = $('.preview-box').length;
        //プレビューが5個あったらラベルを隠す
        if (count == 5) {
          $('.label-content').hide();
        }

        //プレビュー削除したフィールドにdestroy用のチェックボックスがあった場合、チェックを外す=============
        if ($(`#post_pictures_attributes_${id}__destroy`)){
          $(`#post_pictures_attributes_${id}__destroy`).prop('checked',false);
        }
        //=============================================================================

        //ラベルのwidth操作
        setLabel();
        //ラベルのidとforの値を変更
        if(count < 5){
          $('.label-box').attr({id: `label-box--${count}`,for: `post_pictures_attributes_${count}_image`});
        }
      }
    });

    // 画像の削除
    $(document).on('click', '.delete-box', function() {
      var count = $('.preview-box').length;
      setLabel(count);
      var id = $(this).attr('id').replace(/[^0-9]/g, '');
      $(`#preview-box__${id}`).remove();

      //新規登録時と編集時の場合分け==========================================================

      //新規投稿時
      //削除用チェックボックスの有無で判定
      if ($(`#post_pictures_attributes_${id}__destroy`).length == 0) {
        //フォームの中身を削除
        $(`#post_pictures_attributes_${id}_image`).val("");
        var count = $('.preview-box').length;
        //5個めが消されたらラベルを表示
        if (count == 4) {
          $('.label-content').show();
        }
        setLabel(count);
        if(id < 5){
          $('.label-box').attr({id: `label-box--${id}`,for: `post_pictures_attributes_${id}_image`});

        }
      } else {

        //投稿編集時
        $(`#post_pictures_attributes_${id}__destroy`).prop('checked',true);
        //5個めが消されたらラベルを表示
        if (count == 4) {
          $('.label-content').show();
        }

        //ラベルのwidth操作
        setLabel();
        //ラベルのidとforの値を変更
        //削除したプレビューのidによって、ラベルのidを変更する
        if(id < 5){
          $('.label-box').attr({id: `label-box--${id}`,for: `post_pictures_attributes_${id}_image`});
        }
      }
      //=============================================================================
    });
  });
});


(function () {
  var expand;
  expand = function () {
      var $input, $search;
      $search = $('.search');
      $input = $('.input');
      if ($search.hasClass('close')) {
          $search.removeClass('close');
          $input.removeClass('square');
      } else {
          $search.addClass('close');
          $input.addClass('square');
      }
      if ($search.hasClass('close')) {
          $input.focus();
      } else {
          $input.blur();
      }
  };
  $(function () {
      var $accordion, $wideScreen;
      $accordion = $('#accordion').children('li');
      $wideScreen = $(window).width() > 767;
      if ($wideScreen) {
          $accordion.on('mouseenter click', function (e) {
              var $this;
              e.stopPropagation();
              $this = $(this);
              if ($this.hasClass('out')) {
                  $this.addClass('out');
              } else {
                  $this.addClass('out');
                  $this.siblings().removeClass('out');
              }
          });
      } else {
          $accordion.on('touchstart touchend', function (e) {
              var $this;
              e.stopPropagation();
              $this = $(this);
              if ($this.hasClass('out')) {
                  $this.addClass('out');
              } else {
                  $this.addClass('out');
                  $this.siblings().removeClass('out');
              }
          });
      }
  });
  $(function () {
      var $box;
      $box = $('.sm-box');
      $box.on('click', function (e) {
        e.preventDefault();
          var $this;
          $this = $(this);
          if ($this.hasClass('active')) {
              $this.removeClass('active');
          } else {
              $this.addClass('active');
          }
      });
  });
}.call(this));
