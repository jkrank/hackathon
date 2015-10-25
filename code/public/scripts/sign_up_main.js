var page = {};

(function (lib) {
  lib.mobile_reg_exp = /^7(?:[1-4]\d\d|5(?:0[0-8]|[13-9]\d|2[0-35-9])|624|7(?:0[1-9]|[1-7]\d|8[02-9]|9[0-689])|8(?:[014-9]\d|[23][0-8])|9(?:[04-9]\d|1[02-9]|2[0-35-9]|3[0-689]))\d{6}$/;

  lib.normalizeNumber = function (p_number) {
    var first_seven;
    p_number = p_number.replace(/\D/g, '').replace(' ', '');
    first_seven = p_number.indexOf('7');

    if (first_seven !== -1) {
      p_number = "44" + p_number.substring(first_seven);
    } else {
      p_number = "";
    }
    return p_number;
  };

  lib.isMobile = function (v) {
    var p_number = lib.normalizeNumber(v);

    if (lib.mobile_reg_exp.test(p_number.substring(2))) { //to remove the 44
      return true;
    }
    return false;
  };
  lib.handleForm = function (e) {
     var $form = $(this)
       , $form_tel = $form.find("input[name='phone']")
       , tel_number = $form_tel.val();
     if (lib.isMobile(tel_number)) {
       $form_tel.val(lib.normalizeNumber(tel_number));
       return true;
     }
     e.preventDefault();
     return false;
  };
  lib.ready = function () {
    console.log("ready");
    $("#register_form").submit(page.lib.handleForm);
  };
})((page.lib = {}));