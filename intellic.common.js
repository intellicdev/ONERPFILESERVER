/*!
 * Intellic ERP
 * Copyright 2014-2030 Intellic I&S
 * Licensed under Commercial
 */

/* ********************************************************************************************************   
 PAGE NAME : onerp.common.js                                                                                  
 PAGE 내용 : 공통모듈 기능 정의                                                                                                                                      
 COPYRIGHT : onerp                                                                                      
 REMARK    :                                                                                               
 HISTORY                                                                                                   
 1.0       2017.06.16       NEW                                                                            
 ********************************************************************************************************  */ 

//작성대상 : 공용함수, 공통실행
//공용함수 : 각 개별 javascript에서  공통적으로 사용할 함수 선언
//공통실행 : 각 개별 jsp에서 프로그램 실행시 적용할 기능 선언(마지막 부분에 반영), global 적용 파라미터값에 대한 정의도 포함

/*******************************************************************************************************************************
 * constant
 ********************************************************************************************************************************/
var _types = ["BFile", "Blob", "Byte", "Char", "Clob", "Date", "Decimal", "Double", "Long", "LongRaw", "Int16", "Int32", "Int64", "IntervalDS", "IntervalYM", "NClob", "NChar", "NVarchar2", "Raw", "RefCursor", "Single", "TimeStamp", "TimeStampLTZ", "TimeStampTZ", "Varchar2", "XmlType", "BinaryDouble", "BinaryFloat", "Boolean", "varchar", "NVarChar", "int", "varchar(max)", "decimal", "DateTime"];
var _directions = ["Input", "Output", "InputOutput", "ReturnValue"];

var _SearchWrapHeader = '<ul class="filter">';
var _SearchWrapFooter = '</ul>';
var _strSeparator = "^"; 

var gv_headerCellTemplate = function (header, info) {
    $('<div>').html(info.column.caption).css('text-align', 'center').appendTo(header);
};

var Base64 = {

    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        }
        return output;
    },

    // public method for decoding
    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = Base64._utf8_decode(output);
        return output;
    },

    // private method for UTF-8 encoding
    _utf8_encode: function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode: function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}; 

/***********************************************
* 문자값체크, 문자열변환
************************************************/
var fnCheckString = {
	//빈값체크	
	 isEmpty : function(str) {
				     if (typeof str == "undefined" || str == null || str == "")
				         return true;
				     else
				         return false;
				 },
	 //빈값변환
	 isEmptyReplace : function fnCheckString.isEmptyReplace(strOld, strNew) {
	     var numStr;

	     if (typeof strOld == "undefined" || strOld == null || strOld == "") {
	         return strNew;
	     } else {
	    	 strOld = strOld.toString();
	         if (strNew == 0 || strNew == "0" || strNew == 1 || strNew == "1") numStr = strOld.replace(/,/gi, "");
	         else numStr = strOld;
	         return numStr;
	     }
	 } ,
	 /***********************************************
	  * 전화번호 유효성 체크
	  ************************************************/
	 checkPhoneNumber function(p_num) {
	      if (fnCheckString.isEmpty(p_num)) {
	          //console.log("준"); 
	          return "";
	      }
		  	var regExp1 = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;//mobile
		  	var regExp2 = /^\d{2,3}-\d{3,4}-\d{4}$/; //일반전화
		  	//console.log("regExp1==>" + regExp1);
		  	//console.log("regExp2==>" + regExp2);
		  	if (!regExp1.test(p_num) && !regExp2.test(p_num)) {
		  		alert("잘못된 전화번호입니다. 숫자, - 를 포함한 숫자만 입력하십시오.");
		  		return false
		  	}
		  	return true;
	 }
} ;


/*******************************
* description : Yes, No --> bool값으로 변경
********************************/
var fnConvBoolean = {
   //YesNo값을 이용해서 boolean으로 변경
   setIsYesNo : function(vParam) {
	   if (typeof vParam == "undefined" || vParam == null || vParam == ""||vParam == "Y"||vParam == "Yes"||vParam == "YES")
		   {
		   return true;
		   }
	   else
		   {
		   return false;
		  }
	}, 
	//description : Yes, No --> bool값으로 변경
	setStrYesNo : function (vParam) {
		f (typeof vParam == "undefined" || vParam == null || vParam == ""||vParam == true) 
		   {
		   return "Y";
		   }
	   else
		   {
		   return "N";
		  }
	}
};

/***********************************************
* 문자값체크, 문자열변환
************************************************/
var fnReplaceString = { 
		//값일갈변경	
	 replaceAll : function(p_string, p_char_fr, p_char_to) { 
	    var str_return = p_string.replace(/p_char_fr/gi, p_char_to); 
	    return str_return;
	}
} 

/***********************************************
* 날짜포맷정의
************************************************/
var fnConvDate = { 
	getDateFormat : function (p_date, p_format){ 
		v	****************
	 * description : 달력생성
	 * return      : 달력 Object
	 ********************************/
	 setCalendarBox : function (vObjId, vValue, vBool) {
		    if (fnCheckString.isEmpty(vBool)) vBool = false; 
		    $("#" + vObjId).dxDateBox({
		        type: "date",
		        displayFormat: "yyyy-MM-dd",
		        showClearButton: true,
		        value: vValue,
		        disabled: vBool
		    });
		},
	/*******************************
	* description : 연도생성
	* return      : 연도 DropDownLst Object
	********************************/
	 setYearBox : function (vObjId, vValue, vBool) {
	    if (fnCheckString.isEmpty(vBool)) vBool = false; 
	    var now = new Date();
	    var iyear = now.getFullYear() + 1;
	    var aList = new Array(); 
	    var sCode = "code";
	    var sName = "name";
	    var iCount = 10;

	    for (i = 0; i < iCount; i++) {
	        // 객체 생성 
	        var data = new Object();
	        iyear = iyear - 1;
	        data.code = iyear;
	        data.name = iyear + "년";

	        aList.push(data);
	    }

	    gf_setselectboxNoSql(vObjId, aList, sCode, sName, vValue, "", vBool);
	},
	/*******************************
	* description : 월 생성
	* return      : 월 DropDownLst Object
	********************************/
	setMonthBox function(vObjId, vValue, vBool) {
	    if (fnCheckString.isEmpty(vBool)) vBool = false;

	    var aList = new Array();
	    var iMonth = 0;
	    var sCode = "code";
	    var sName = "name";
	    var iCount = 12;

	    for (i = 0; i < iCount; i++) {
	        // 객체 생성 
	        var data = new Object();
	        iMonth = i + 1;
	        iMonth = iMonth >= 10 ? iMonth : '0' + iMonth;
	        data.code = iMonth;
	        data.name = iMonth + "월";

	        aList.push(data);
	    }

	    gf_setselectboxNoSql(vObjId, aList, sCode, sName, vValue, "", vBool);
	},
	/*******************************
	* description : 년.월 생성
	* return      : 년.월 DropDownLst Object
	********************************/
	setYearMonthBox : function (vObjId, vValue, vBool) {
	    if (fnCheckString.isEmpty(vBool)) vBool = false;

	    var aList = new Array();
	    var now = new Date();
	    var iyear = now.getFullYear();
	    var iMonth = 0;
	    var sCode = "code";
	    var sName = "name";
	    var iCount = 12;

	    for (i = 0; i < iCount; i++) {
	        // 객체 생성 
	        var data = new Object();
	        iMonth = i + 1;
	        iMonth = iMonth >= 10 ? iMonth : '0' + iMonth;
	        data.code = iyear+ '' +iMonth;
	        data.name = iyear + '년 ' + iMonth + "월";

	        aList.push(data);
	    }

	    gf_setselectboxNoSql(vObjId, aList, sCode, sName, vValue, "", vBool);
	},
	/*******************************
	* description : 24시 생성
	* return      : 24시 DropDownLst Object
	********************************/
	setHourBox function(vObjId, vValue, vBool) {
	    if (fnCheckString.isEmpty(vBool)) vBool = false;

	    var aList = new Array();
	    var iMonth = 0;
	    var sCode = "code";
	    var sName = "name";
	    var iCount = 24;

	    for (i = 0; i < iCount; i++) {
	        // 객체 생성 
	        var data = new Object();
	        iMonth = i 
	        iMonth = iMonth >= 10 ? iMonth : '0' + iMonth;
	        data.code = iMonth;
	        data.name = iMonth + "시";

	        aList.push(data);
	    }

	    gf_setselectboxNoSql(vObjId, aList, sCode, sName, vValue, "", vBool);
	},

	/*******************************
	* description : 00,30분 생성
	* return      : 분 DropDownLst Object
	********************************/
	setminuteBox function (vObjId, vValue, vBool) {
	    if (fnCheckString.isEmpty(vBool)) vBool = false;

	    var aList = new Array();
	    var iMonth = 0;
	    var sCode = "code";
	    var sName = "name";
	    var iCount = 12;

	    // 객체 생성 
	    var data = new Object();

	    data.code = session.CLIENT;
	    data.name = "00분";
	    aList.push(data);

	    // 객체 생성 
	    var data = new Object();

	    data.code = "30";
	    data.name = "30분";
	    aList.push(data);

	    gf_setselectboxNoSql(vObjId, aList, sCode, sName, vValue, "", vBool);
	},
	 
	/*******************************
	* description : 달력형식 변환
	* return      : yyyy-MM-dd
	********************************/
	getDate function(vDate) {
	    if (fnCheckString.isEmpty(vDate)) return "";

	    var sData = new Date(vDate);

	    if (vDate.length == 8) return vDate;
	    else if (vDate.length == 10) {
	        vDate = vDate.replace(/-/gi, '');
	        vDate = vDate.replace(/./gi, '');
	        return vDate;
	    } else return gf_setFormatDate(sData);
	},

	/*******************************
	* description : Date Type 연도 추출
	* return      : yyyy
	********************************/
	getYear function (date) {
	    var year = date.getFullYear();

	    return year;
	},

	/*******************************
	* description : Date Type 월 추출
	* return      : mm
	********************************/
	getMonth function (date) {
	    var month = (1 + date.getMonth());                     //M 
	    month = month >= 10 ? month : '0' + month;     // month 두자리로 저장 
	    return month;
	},

	/*******************************
	* description : 달력형식 변환
	* return      : yyyy-MM-dd
	********************************/
	setFormatDate function(date) {
	    var year = date.getFullYear();                                 //yyyy 
	    var month = (1 + date.getMonth());                     //M 
	    month = month >= 10 ? month : '0' + month;     // month 두자리로 저장 
	    var day = date.getDate();                                        //d  
	    day = day >= 10 ? day : '0' + day;                            //day 두자리로 저장 
	    return year + '' + month + '' + day;
	}, 
	/*******************************
	* description : 오늘 날자 가져오기
	* return      : yyyyMMdd
	********************************/
	getToday function() {
	    var now = new Date();
	    var sToday;
	    sToday = gf_setFormatDate(now);

	    return sToday;
	},
	/***********************************************
	* 날짜포맷정의
	************************************************/
	getNowTimeStamp : function () {  
	    var d = new Date();  

	    var s = gf_fillZeros(d.getFullYear(), 4) + '-' +
	            gf_fillZeros(d.getMonth() + 1, 2) + '-' +
	            gf_fillZeros(d.getDate(), 2) + ' ' +
	      
	            gf_fillZeros(d.getHours(), 2) + ':' +
	            gf_fillZeros(d.getMinutes(), 2) + ':' +
	            gf_fillZeros(d.getSeconds(), 2);

	    return s;  
	},
	getNowDateStamp : function () {
	    var d = new Date();

	    var s = gf_fillZeros(d.getFullYear(), 4) + '-' +
	        gf_fillZeros(d.getMonth() + 1, 2) + '-' +
	        gf_fillZeros(d.getDate(), 2)  
	    //console.log(s);
	    return s;
	} ,
	/***********************************************
	* Date Format
	* @param str : number
	* @return : xxxx,xxx0.00
	************************************************/
	setNumber : function(str) {
	    var result = "";

	    if (fnCheckString.isEmpty(str)) str = "";
	    else {
	        var a_number = str.split(".");
	        var a_minus = str.split("-");

	        if (a_number.length > 2) {
	            alert("잘못된 숫자 형식입니다.");
	            return false;
	        } else {             
	            var num_str = a_number[0].replace(/,/gi, "");
	            var num_str = a_number[0].replace(/-/gi, "");

	            for (var i = 0; i < num_str.length; i++) {
	                var tmp = num_str.length - (i + 1);

	                if (((i % 3) == 0) && (i != 0)) result = ',' + result;
	                result = num_str.charAt(tmp) + result;
	            }

	            if (a_number.length == 2) result = result + "." + a_number[1];

	            if (a_minus.length > 1) result = "-" + result;
	        }
	    }
	    return result;
	} 
};


/*******************************************************************************************************************************
 * 숫자형식변환
 ********************************************************************************************************************************/
var fnConvNumber = {
		//천단위 , 표시
    numberWithCommas : function(x) {
	    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}:


//JSON dateFormat 변경   ex - /date(123123132)/ 


/***********************************************
* CLOB 문자 만들기
* @param str : string
* @param strAppend : Append 문자
* @param strSeparotor : charter
* @param strNull : null 대체 문자
* @return : Append String
************************************************/ 
var fnClobData = {
	setClobData : function (strString, strAppend, strSeparator, strNull) { 
	    if (fnCheckString.isEmpty(strNull)) strNull = " ";
	    if (fnCheckString.isEmpty(strSeparator)) strSeparator = "^"; 
	    strAppend += fnCheckString.isEmptyReplace(strString, strNull) + strSeparator; 
	    return strAppend;
	}
};
/*******************************
* description : Yes, No --> bool값으로 변경
********************************/
// Object Array json 포맷 변경 정의
var fnConvDataType = {
		// Object Array json 포맷 변경 정의
    objectToArray : function(vObject) {
	  var vArray = $.map(vObject, function(value,index){
		return [value];
	    })
	   return vArray;
	},

	/*******************************
	 * description : Columns data 변환
	 *******************************/
	jsonToColumns : function(json) {
	    var columns = { "dataField": [], "caption": [], "alignment": [] }; 
	    var dataField, caption, alignment; 
	    //alert(json.parameters.length);
	    for (var i = 0; i < json.parameters.length; i++) {
	        dataField = json.parameters[i].dataField;
	        if (dataField == null || dataField == "") {
	            return null;
	        } 
	        caption = json.parameters[i].caption;
	        if (caption == null || caption == "") {
	            caption = dataField;
	        } 
	        alignment = json.parameters[i].alignment;
	        if (alignment == null || alignment == "") {
	            return null;
	        }
	        columns.dataField.push(dataField);
	        columns.caption.push(caption);
	        columns.alignment.push(alignment);
	    }
	    return columns;
	},
	JsonDateToString : function(str) { 
		 if (str == null) { 
		     return null; 
		 } 
		 else if (str.indexOf("Date") >= 0) { 
		     return new Date(Date(str)).toISOString().substr(0, 10); 
		 }

		 else if (str.length === 8) { 
		     return str.substr(0, 4) + "-" + str.substr(4, 2) + "-" + str.substr(6, 2); 
		 }

		 else if (str.length === 10) { 
		     return str; 
		 }  
		 return null; 
	 }
		 
};

/*******************************************************************************************************************************
 * description :  url 관련 기능 모음
 ********************************************************************************************************************************/ 
var fnUrlInfo = { 
		// get방식의 파라미터를 읽어서 object로 전환하는데 이용
	getUriParams : function (){
		var params = {};
		window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) { params[key] = value; });
		return params;        	
	},
	/***********************************************
	  * 화면 가운데 window.open
	 ************************************************/
	OpenWindow : functionw(page, name, width, height) {
	 	var left = width > 1600 ? 0 : (screen.availWidth - width) / 2;
	 	var top = height > 900 ? 0 : (screen.availHeight - height) / 2 - 10;
	 	var option = 'scrollbar=yes, toolbar =no, resizable=yes, scrollbars=no, status=no ,location=no, menubar=no';
	 	//	option 		+= ',titlebar=no,menubar=no,fullScreen=no';
	 	option += ',width=' + width + ',height=' + height;
	 	option += ',left=' + left + ',top=' + top;

	 	var win = window.open(page, name, option);
	 	return win;
	 } 
};

var fnAjaxInfo = { 
	SetAjaxParam : function(P_URL_INFO, P_WORK_TYPE, P_PARAM){
		var param = fnConvDataType.object2array(P_PARAM);
		var ajaxparamObj = {
		    urlname : P_URL_INFO.urlname,
		    procedureName : P_URL_INFO.procedureName, 
		    param :param, 
		    clientCode : P_PARAM.clientCode,
		    langId : P_PARAM.langId, 
		    parameters : {
				"procedure": P_URL_INFO.procedureName,
				"workType": P_WORK_TYPE,
				"params": param
		    }   
		}
		return ajaxparamObj;
	}
};

/*******************************************************************************************************************************
 * description :  공통으로 사용할 시스템 정보 정의 함수
 ********************************************************************************************************************************/ 
var fnSystemInfo = {
		// session 가져오기
    getsession : function getsession() {
	    var _session = {}; 
	    _session = JSON.parse($("#session-key").val()); 
		    return _session; 
		},
 
		// 화면페이지에 존재하는 서버정보를 가지고 와서 변수로 사용
	getseverinfo :function() {
	    var _serverinfo = ""; 
	    _serverinfo = $("#session-server").val(); 
	    return _serverinfo; 
	} ,
		// get방식의 파라미터를 읽어서 object로 전환하는데 이용
	checkSession : function (){ 
		 session = this.getsession();
	    //alert(JSON.stringify(session)); 
		  if (session.EMP_NO == null) {
		      alert("세션이 만료 되었습니다.\n다시 접속하십시요.");
		      try {
		          parent.document.location.href = "/common/login.do";
		      } catch(e) {
		          document.location.href = "/common/login.do";
		      } finally{
	
		      }
		  }
	} ,
	/***********************************************
	* Search Popup
	************************************************/
	getIP : function() {
	     var sIPAddress;

	     $(function () {
	         $.getJSON("https://api.ipify.org?format=jsonp&callback=?",
	           function (data) {
	               alert("??"+JSON.stringify(data));
	               sIPAddress = data.ip;
	           }
	         );
	     });
	     return sIPAddress;
	 }

};
 
/*******************************************************************************************************************************
* 메뉴관련 기능 함수 정의
********************************************************************************************************************************/  
var fnMenuId = function { 
	//menu_id값을 get string에서 받음
	getMenuId :function ()
	{
	    var oparams = fnSystemInfo.getUriParams;
		var gMenuId = oparams.MENU_ID;	
		if (typeof gMenuId == "undefined" || gMenuId == null || gMenuId == "")
	         return "";
	    else
	         return gMenuId;        	
	} ,
	/메뉴권한체크용
	userMenuAuth : function (menuId) 
	  {
		var returnvalue = {};
		var suserid = session.USER_ID;
		var suserPc = session.USER_PC;
		if (suserPc==null)
			{
			suserPc = "ERP";
			}
	    var menuparamObj = {
				"clientCode" : session.CLIENT_CODE,   //P_CLIENT_CODE
				"companyCode" : session.COMPANY_CODE,  //P_COMPANY_CODE
				"langId" : session.LANG_ID,  //p_lang_id
				"userIdP" : session.USER_ID, //p_user_id 
				"menuId" : menuId ,   //P_MENU_ID 
				"userId" : suserid,    //p_userid
				"userPc" : suserPc    //p_pc
	    };   
	    
	    var urlname = serverRoot + "common/call/nonatomic.do";
	    var procedureName = "P_GETACCESSAUTHQ";
		var param = $.map(menuparamObj, function(value,index){
			return [value];
		});  
	   // var url = serverRoot + "common/listbox/list.do";
		var parameters = {
			"procedure": procedureName,
			"workType": "Q",
			"params": param
		};   
		 $.ajax({
		     type: "POST",
		     url: urlname,
		     data: parameters,
		     dataType: "json",
		     success: function (data) {
		         // 성공처리
		         //alert(JSON.stringify(data));
		    	 var res =  data.list;
		    	 if (res == null){
		    		 return;
		    	 }
		    	 else{
			         var rowcount = data.list.length;
			         if (rowcount > 0) {
			        	returnvalue = { 
							        	gViewAuth : data.list[0].FORM_VIEW_YN,
							        	gPrintAuth : data.list[0].FORM_PRINT_YN,
							        	gSaveAuth : data.list[0].FORM_SAVE_YN,
							        	gDeleteAuth : data.list[0].FORM_DELETE_YN, 
							        	gParameterInfo : data.list[0].PARAMETER_INFO
							          }; 
			         }
			        	//console.log("gDeleteAuth :" + gDeleteAuth );
			         }
			         else{
			        	//var strerrorStr =  data.errorCode + " : 등록된 메세지가 없습니다";
			            //alert("message > " + strerrorStr);
			        	 return; 
			         }
		    	 }
		     },
		     error: function (request, status, error) {
		         alert("error : " + JSON.stringify(error));
		         return; 
		     }
		 });
		return returnvalue;
	}
};

/*******************************
 * description : returnMessage 호출 함수
 * parameter1  : parameter code
 * return      : return 된 json 또는 에러 
 ********************************/ 
var fnMessage = function ()
{ 
	//message return
	getMessage : function(		
		  p_work_type
		, p_client_code
		, p_lang_id
		, p_error_type 
		, p_error_code 
		) {
		 var url = serverRoot + "common/applMessage/list.do";
		 var json = { 
		  		"workType": p_work_type,
		  		"clientCode": p_client_code,
		  		"langId": p_lang_id,
		  		"errorType": p_error_type,
		  		"errorCode": p_error_code  
		  	};
		 
		 var data = json;
		 $.ajax({
		     type: "POST",
		     url: url,
		     data: data,
		     dataType: "json",
		     success: function (data) {
		         // 성공처리
		         //alert(JSON.stringify(data));
		         var rowcount = data.list.length;
		         if (rowcount > 0) {
		        	var strerrorStr = data.list[0].ERROR_STR;
		            alert("message > " + p_error_code +" : " + JSON.stringify(strerrorStr));
		         }
		         else{
		        	var strerrorStr = p_error_code + " : 등록된 메세지가 없습니다";
		            alert("message > " + strerrorStr);
		         }
		     },
		     error: function (request, status, error) {
		     	// 실패처리
		     	//alert("err");
		     	//console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
		     }
		 });
	}
}; 

/********************************
 * 자동 tag 생성 또는 초기화 처리용
 *******************************/
var fnHtmlGroup = {
	// button group 생성용도
	setBtnGroup : function (buttonObj, position) {
	    var  sButtonItem, sType, sName, sClass, sId;
	    var t=buttonObj.length-1, j=0;
	   // console.log(buttonObj.length);
	    sButtonItem = "";
	    sButtonItem += "<div class=\"ibutton-box clearfix\">";
	    if (fnYesNo.fnCheckString.isEmpty(position)) { position ="R";};
	    //console.log("position : " + position);
	    if (position=="L"){
		    for (var i = 0 ; i < buttonObj.length; i++) {  
		    	sName = buttonObj[i].buttonName; 
		    	sClass = "btn ibutton-item " + buttonObj[i].buttonClass+" float-left"; 
		    	sId = buttonObj[i].buttonId; 
		       sButtonItem += "<button type=\"button\" class=\""+sClass+" "+sId+"\" id=\""+sId+"\">"+sName+"</button>";   
		    }  
	    }
	    else{ 
	        for (var i = 0 ; i < buttonObj.length; i++) {  
	        	j = t - i;
	        	sName = buttonObj[j].buttonName; 
	        	sClass = "btn ibutton-item " + buttonObj[j].buttonClass+" float-right"; 
	        	sId = buttonObj[j].buttonId; 
	            sButtonItem += "<button type=\"button\" class=\""+sClass+" "+sId+"\" id=\""+sId+"\">"+sName+"</button>";   
	        }  
	    }
	    sButtonItem += "</div>";
	    //console.log("sButtonItem :" + sButtonItem);
	    return sButtonItem;
	},

	 // description : 검색항목구성 Setting(복잡한 태그를 자동으로 구성)  
	setSearchItemStr : function (pColumObj) {
		 var vColumnObj = pColumObj;
		 var sSearchItem = "";
		 var vColumnLabelRequire = "";
		 var vColumnId = vColumnObj.columnId , 
		     vColumnLabel = vColumnObj.columnLabel,
		     vColumnType = vColumnObj.columnType,
		     vColunmRequire = vColumnObj.columnRequire,
		     vColumnLength =vColumnObj.columnLength; 
		// console.log("vColunmRequire :" + vColunmRequire);
		 sSearchItem += "<label for=\""+vColumnId+"\" class=\"" + vColunmRequire + "\">" + vColumnLabel+"</label>" ;  
		 sSearchItem += "<div class=\"input-group ifield-item " + vColumnLength + "\">" ;
		 sSearchItem += "<div class=\"input-group-prepend\">" ;
		 sSearchItem += "<span class=\"input-group-text\"><i class=\"fas fa-check\"></i></span>"; 
		 sSearchItem += "</div>" ;
		 if (vColumnType=="select"){
		    sSearchItem += "<select class=\"search-ddl form-control\" id=\""+vColumnId+"\"></select>" ;
		 }
		 else if (vColumnType=="text"){
			sSearchItem += "<input type=\"text\" class=\"search-ddl form-control\" id=\""+  vColumnId + "\" placeholder=\"\">"; 
		 }
		 else if (vColumnType=="date"){
			sSearchItem += "<input type=\"text\" class=\"search-ddl form-control\" id=\"" + vColumnId + "\">"; 
		}
		 sSearchItem += "</div>" ; 
		// console.log("sSearchItem :" + sSearchItem);
	    return sSearchItem;
	},
	 // description : 검색항목구성 Setting(복잡한 태그를 자동으로 구성) 
	setSearchItemTag :	function(){ 
	    /*초기값 셋팅 */ 
		var $columnItem = $('.isearch-item');
		$columnItem.each(function(i){   
		      // console.log("["+i+"번째]: "+$(this).text()); 
		      var columnRequire = "";
		     if ($(this).attr("data-require") =="Y"){
		    	 columnRequire ="ilabel-require";
		  	 }
		  	 else{
		  		columnRequire ="ilabel";
		  	 }
		    var searchItemObj = {
		       columnId:$(this).attr("data-column"),
		       columnLabel:$(this).attr("data-label"),
		       columnRequire:columnRequire,
		       columnType:$(this).attr("data-type"),
		       columnLength:$(this).attr("data-length") 
		       };
		//	 console.log("vColumnLabelRequire1 :" + $(this).attr("data-require"));
		//	 console.log("vColumnLabelRequire2 :" + columnRequire);
		    var searchItem = this.setSearchItemStr(searchItemObj);
		    $columnItem.append(searchItem);
		}); 
	}, 
	// description : 필드항목 구성 --> 세부태그 자동 생성용 
	setFieldItemStr : function(pColumObj) {
		 var vColumnObj = pColumObj;
		 var sFieldItem = "";
		 var vColumnLabelRequire = "";
		 var vColumnId = vColumnObj.columnId , 
		     vColumnLabel = vColumnObj.columnLabel,
		     vColumnType = vColumnObj.columnType,
		     vColunmRequire = vColumnObj.columnRequire,
		     vColumnLength =vColumnObj.columnLength;
		  
		 sFieldItem += "<div class=\"form-group field-group icolumn-item\"</div>" ;  
		 sFieldItem += "<label for=\""+vColumnId+"\" class=\"" + vColunmRequire + "\">" + vColumnLabel + "</label>" ;  
		 sFieldItem += "<div class=\"input-group ifield-item "+ vColumnLength + "\">" ;
		 //var sFieldItem += "<div class=\"input-group-prepend\">" ;
		 //var sFieldItem += "<span class=\"input-group-text\"><i class=\"fas fa-check"\"></i></span>"; 
		 //var sFieldItem += "/div>" ;
		 if (vColumnType=="select"){
			 sFieldItem += "<select class=\"form-control\" id=\"" + vColumnId + "\"></select>" ;
		 }
		 else if (vColumnType=="text"){
			sFieldItem += "<input type=\"text\" class=\"form-control\" id=\"" + vColumnId + "\" name=\"" + vColumnId + "\" placeholder=\"\">"; 
		 }
		 else if (vColumnType=="checkbox"){
			sFieldItem += "<input type=\"checkbox\" class=\"form-check-input form-control\" id=\"" + vColumnId + "\">"; 
		}
		 else if (vColumnType=="date"){
			sFieldItem += "<input type=\"text\" class=\"form-control\" id=\"" + vColumnId + "\">"; 
		}
		 sFieldItem += "</div>" ; 
		 //console.log("sFieldItem :" + sFieldItem);
		    return sFieldItem;  
		} ,
 
		 // description : 검색항목구성 Setting(복잡한 태그를 자동으로 구성)  
	setFieldItemTag : function(){ 
	    /*초기값 셋팅 */
		//var countSearch = $('.icolum-item').length; 
		var $columnItem = $('.icolumn-item');
		$columnItem.each(function(i){   
	     //  console.log("["+i+"번째]: "+$(this).text()); 
		      var columnRequire = "";
			     if ($(this).attr("data-require") =="Y"){
			    	 columnRequire ="ilabel-require";
			  	 }
			  	 else{
			  		columnRequire ="ilabel";
			  	 }
		    var fieldItemObj = {
			       columnId:$(this).attr("data-column"),
			       columnLabel:$(this).attr("data-label"),
			       columnRequire:columnRequire,
			       columnType:$(this).attr("data-type"),
			       columnLength:$(this).attr("data-length")
		       };
			// console.log("vColumnLabelRequire1 :" + $(this).attr("data-require"));
			// console.log("vColumnLabelRequire2 :" + columnRequire);
		    var fieldItem = this.setFieldItemStr(fieldItemObj);
		    $columnItem.append(fieldItem);
		}); 
	},
	setInitialValue function(pObject){ 
        var ObjList = pOblect;
        var totalLength = ObjList.length;
	    for (var i = 0 ; i < ObjList.length; i++) {  
	    	var $selector = ObjList[i].fieldItem;
		    $($selector).val(""); 
	    }   
	}
};
 

/********************************
 * description : column grid 속성 추가반영
 *  parameter1  :column 속성
 *  targets  : columns의 순서를 의미. 자동부여목적
 *  name  :column 이름. data의 값을 가지고 같이 사용할 수 있도록 자동 구성 
 *  배열내 객체값을 받아서 객체내 값 추가 --> parameter format : [{},{}}
 *******************************/
var fnDataTableGrid = {  
	tableDefObj : function { 
		var tableDef = { 
		        "data": "", 
		        "ajax": "", 
			    //"columns":vColumns,
		        "columnDefs": "",
		        "select":true,
		        "responsive": true,
		        "destroy": true,
		        "retrieve": true,
		        "autoWidth": false,
		        "searching": false,
		        "paging":   false,  
		        "info": false ,
		        "filter": false ,
		        "lengthChange": true ,
		        "stateSave": false ,
		        "scrollX": true ,
		        "scrollY": 200 ,
		        "scrollCollapse": true , 
		        "aDataSort": [[1, 'asc']]
		    } ;

	    return tableDef;
	}, 
	//Grid 상단 tag 자동 구성용도
	setGridHtml : function(vObjId, vColumns) { 
		var $gridName = $("#" + vObjId);
		var tableName = "tbl"+ vObjId;
		var $tableName = $("#" +tableName);
		var tableString = "";
		var theadString = "";
		var caption = "";
		tableString = "<table class=\"table table-hover table-striped display\" id=\""+tableName+"\"><thead>";
		var data = vColumns;
		//console.log("tableString :" + data);
		for (i = 0; i < data.length; i++) {
			var rowData = data[i];
			$.each(rowData, function() {
				  var key = Object.keys(this)[0];
				  var value = this[key]; 
			 }); 
			caption = rowData.caption;
		    theadString = theadString + "<th>" + caption + "</th>";
		}
		tableString = tableString + theadString ;
		tableString = tableString + "</thead></table>";
		//console.log("tableString :" + tableString);
		$gridName.html(tableString);
	},
	setGridColPropery : function(vColumns){
		var vGridColObj = vColumns;
		for (var i = 0 ; i < vGridColObj.length; i++) {   
			vGridColObj[i].targets = i; 
			vGridColObj[i].name = vGridColObj[i].data;  
	    }  
		return vGridCol;
    }, 
/********************************
 * description : DataTable Grid Layout 생성
 *******************************/
    setGridLayout : function(vObjId, vColumns, vData) { 
		var $gridName = $("#" + vObjId);
		var tableName = "tbl"+ vObjId;
		var $tableName = $("#" +tableName);
		var vGridCol = this.setGridColPropery(vColumns);
		this.setGridHtml(vObjId, vColumns);  
		var tableDef = this.tableDefObj();
		tableDef.columDefs = vGridCol;
		tableDef.data = vData;
		var table =  $tableName.DataTable(tableDef); 
		return table;
	},
/********************************
 * description : DataTable Grid Layout 생성
 *******************************/
	setGridLayout_View : function(vObjId, vColumns, vData) { 
		var $gridName = $("#" + vObjId);
		var tableName = "tbl"+ vObjId;
		var $tableName = $("#" +tableName);	
		var vGridCol = this.setGridColPropery(vColumns);
		
		//console.log("vGridCol:"+JSON.stringify(vGridCol));
		this.setGridHtml(vObjId, vColumns); 
		var tableDef = this.tableDefObj();
		tableDef.columDefs = vGridCol;
		tableDef.data = vData;
		tableDef.filter = true;
		var table =  $tableName.DataTable(tableDef); 
		return table;
	},

	/********************************
	 * description :DataTable  Grid Layout 생성
	 *******************************/
	setGridLayout_View2 : function(vObjId, vColumns) {	
		var vGridCol = this.setGridColPropery(vColumns);
		var $gridName = $("#" + vObjId);
		var tableName = "tbl"+ vObjId;
		var $tableName = $("#" +tableName);
		
		//console.log("vGridCol:"+JSON.stringify(vGridCol));
		this.setGridHtml(vObjId, vColumns); 
		var tableDef = this.tableDefObj();
		tableDef.columDefs = vGridCol;
		tableDef.data = vData;
		tableDef.filter = true;
		var table =  $tableName.DataTable(tableDef); 
		return table;
    }
};

/*******************************
 * description : form Default Layout 설정
 * parameter1  : 주요 layout의 margin, padding 설정 
 ********************************/
var fnFormLayout = {
	//layout적용할 항목들을 동적으로 생성하고자 변수선언
	setLayOutList : function(){
		var layoutlist = 
	    [
			{"selector":".ibutton-group" , "className": "p-2"},
			{"selector":".isearch-group" , "className": "p-2"},
			{"selector":".icolumn-item" , "className": "p-2"},
			{"selector":".icard", "className": "p-2"},
			{"selector":".icol-column" , "className": "p-2"},
			{"selector":".icard-table" , "className": "p-2"},
			{"selector":".ifield-item" , "className": "p-2"},
			{"selector":".ilabel-require" , "className": "p-2"},
			{"selector":".ibutton-item" , "className": "w-10 mx-1"}   
		];
	    return layoutlist;
	},
	//layout용 class할당
	setFormLayout : function (){
		var layoutlist = this.setLayOutList;
		var totalLength = this.layoutlist.length;
		for (var i = 0 ; i < totalLength; i++) {   
			 $(layoutlist.selector).addClass(layoutlist.className);  
	    } 
	}  
};



/************************************
 * File upload 파일.
 * p_source_type : Table 명 
 * p_source_code : Table Key
 * p_message : 성공 메세지 (없으면 Alert 창을 생성하지 않고 넘어감)
 * return : (성공 : true, 실패 : false) 
 ***********************************/
var fnFileService = {
fileUpload : function(p_client_code , p_company_code ,p_source_type, p_source_code, p_message , p_source_category , p_callfrom) {
    var sBool = false;
    var data = new FormData();
    //var files = $("input#AttachFile").get(0).files;
/*
     var sBool = false;
     var data = new FormData();
     //var files = $("input#AttachFile").get(0).files; 

     // 체크박스 배열 Loop 
	$("input[type=file]").each(function (idx) {

         // 해당 체크박스의 Value 가져오기
         var files = $(this).get(0).files;
		 //alert(files.length);
         if (files.length > 0) {
			
             sBool = true;
             data.append(("attachFile" + idx), files[0]); 
         }
     });
	//alert(sBool); 
     data.append("client_code", p_client_code);
     data.append("company_code", p_company_code);
     data.append("lang_id", "KO");
     data.append("user_id", session.USERID); 
     data.append("source_type", p_source_type);
     data.append("source_code", p_source_code);
     data.append("source_category", p_source_category);
     data.append("callfrom", p_callfrom);

*/

    // 체크박스 배열 Loop 
	
    $("input[type=file]").each(function (idx) { 
        // 해당 체크박스의 Value 가져오기
        var files = $(this).get(0).files; 
        if (files.length > 0) { 
            sBool = true;
            data.append(("attachFile" + idx), files[0]);
			//  data.append(("attachFile" + idx), files[0]);  
        }
    });
      

    var json = {
     		"procedure": "p_hress4000_s",
     		"workType": p_work_type,
     		"params": [p_client_code
     				  ,p_company_code
     			      ,p_lang_id 
     				  ,p_source_type 
     				  ,p_source_code 
     				  ,p_source_no 
     				  ,p_source_category 
     				  ,p_callfrom  
     			      ,p_userid
     			      ,p_pc]  
     	};
    var data = json;
    //console.log("sBool  "+ sBool);
    //console.log("data  " + JSON.stringify(data));

	//alert("common file  "+JSON.stringify(data));
     if (sBool) {
         $.ajax({
             type: "POST",
             url: "/Common/JSONFileUpload",
             data: data,
             processData: false,
             contentType: false,
             success: function (response) { 
                //console.log("file upload");
                if (!fnCheckString.isEmpty(p_message)) alert(p_message);
                //console.log("첨부파일등록성공");
                opener.mf_btnSearch();
                window.close();
                return true;
            },
             error: function (request, status, error) {
             	// 실패처리
             	//alert("err");
             	//console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
             	alert("첨부파일등록실패!!!!");
             }
         });
     } else {
         opener.mf_btnSearch();
         //self.close();
         return true;
     }
 },

/************************************
 * File upload 생성
 * p_file_no : ('01', '02'...) 
 ***********************************/
 setFileBox : function(p_file_no) {
     var strHtml = "";
     
     strHtml = '<input class="upload-name" id="filename_' + p_file_no + '" value="파일선택" disabled="disabled"> <label for="ex_filename_' + p_file_no + '">업로드</label> <input type="file" id="ex_filename_' + p_file_no + '" class="upload-hidden">';

     $("#filebox_" + p_file_no).empty().append(strHtml);

     $("#ex_filename_" + p_file_no).on('change', function () { // 값이 변경되면 
         if (window.FileReader) { // modern browser 
             var filename = $(this)[0].files[0].name;
         } else { // old IE 
             var filename = $(this).val().split('/').pop().split('\\').pop(); // 파일명만 추출 
         }

         // 추출한 파일명 삽입 
         $("#filename_" + p_file_no).val(filename);
         //$(this).siblings('.upload-name').val(filename);
     });
 },

 /************************************
  * File upload 생성
  * p_file_no : ('01', '02'...) 
  ***********************************/
 setFileList function(p_data) {
     var strHtml = "";

     strHtml = '<input class="upload-name" id="filename_' + p_file_no + '" value="파일선택" disabled="disabled"> <label for="ex_filename_' + p_file_no + '">업로드</label> <input type="file" id="ex_filename_' + p_file_no + '" class="upload-hidden">';

     $("#filebox_" + p_file_no).empty().append(strHtml);

     $("#ex_filename_" + p_file_no).on('change', function () { // 값이 변경되면 
         if (window.FileReader) { // modern browser 
             var filename = $(this)[0].files[0].name;
         } else { // old IE 
             var filename = $(this).val().split('/').pop().split('\\').pop(); // 파일명만 추출 
         }

         // 추출한 파일명 삽입 
         $("#filename_" + p_file_no).val(filename);
         //$(this).siblings('.upload-name').val(filename);
     });
 },

 /************************************
  * 첨부파일 오픈.
  * p_file_no : ('01', '02'...) 
  ***********************************/
 downloadFile : function (p_sourceType, p_sourceCode, p_fileName) {
     //window.open("../fileServer/" + p_sourceType + "/" + p_sourceCode + "/" + p_fileName , "file", "scrollbars = yes");
     window.open("../DocMan/" + p_sourceType + "/" + p_sourceCode + "/" + p_fileName, "file", "scrollbars = yes");
 }
 };


/*******************************
 * description : Stored Procedure 호출 함수
 * parameter1  : Bizcomponent 가져와서 selectbox만들기
 * return      : return 된 json 또는 에러 
 ********************************/
var fnSelectBox = {
//function gf_setselectboxWithSql(p_selectboxid, p_work_type, p_param, p_column, p_sub_code, p_code_name, p_defaultvalue, p_allyn, p_disabled) {
	setselectboxWithSql : function( p_work_type, p_param, p_column) {
		    var selectObj = p_column;
		    var p_column_name, p_sub_code, p_code_name, p_defaultvalue, p_allyn, p_disabled; 
		    p_column_name = selectObj.colName; 
		    p_sub_code = selectObj.subCode; 
		    p_code_name = selectObj.codeName; 
		    p_defaultvalue = selectObj.defaultValue; 
		    p_allyn = selectObj.allYn; 	  
		   // console.log("p_sub_code : " + p_sub_code);
			//  console.log("p_code_name : " + p_code_name);
			//  console.log("p_allyn : " + p_allyn); 
		    p_disabled = selectObj.isDisabled; 
		    if (fnCheckString.isEmpty(p_disabled)) p_disabled = false;
		
		
		    var urlname = serverRoot + "common/call/nonatomic.do";
		    var procedureName = "P_LISTBOX_Q";
			var param = $.map(p_param, function(value,index){
				return [value];
			});  
		   // var url = serverRoot + "common/listbox/list.do";
			var parameters = {
				"procedure": procedureName,
				"workType": p_work_type,
				"params": param
			}; 
		    //console.log("호출전 data : " + JSON.stringify(data)); 
		    //var selectlist = "";var $dialog = $('#' + settings.id);
		    var $selectBox = $('#'+p_column_name);
		    $.ajax({
		        type: "POST",
		        //url: serverRoot + "common/call/nonatomic.do",
		        url: urlname,
		        data: parameters,
		        dataType: "json",
		        success: function (data) {
		            // 성공처리 
		            //console.log("호출후 data : " + JSON.stringify(data));
		            if (data.errorMessage == null) {
		              if (data.list==null)
		              {
		                null;
		                //alert("조회할 데이타가 없습니다.");
		              }
		              else{
		               
		                var rs = data.list;
		              //  console.log("rs : " + JSON.stringify(data.list)); 
		                if (p_allyn=="Y")
		                {
		                  var obj = {};
		                  obj[p_sub_code] = "";
		                  obj[p_code_name] = "전체";
		                  rs.unshift(obj); 
		                }
		                var lenData = rs.length;
		                //console.log("ledData : " + lenData);
		                //console.log("rs==? "+JSON.stringify(rs));
		                if (lenData > 0)
		                {
		                    var pOption = "";
		                    for (var i=0; i<lenData; i++){
		                    	if (rs[i][p_sub_code] ==  p_defaultvalue)
		                    	{
		                    		pOption += "<option value=\""+rs[i][p_sub_code]+"\" selected=\"selected\">"+rs[i][p_code_name]+"</option>";
		                       		//console.log("pOption : " + pOption);
		                    	}
		                    	else
		                		{
		                    	  pOption += "<option value=\""+rs[i][p_sub_code]+"\">"+rs[i][p_code_name]+"</option>";
		                          //console.log("pOption : " + pOption);
		                		}
		                    }
		                    $selectBox.append(pOption);  
		                }
		                if (p_disabled==true){
		                	 $selectBox.attr("disabled","true"); 
		    	        }  
		              }
			        }
			        else{
		                alert("errorMessage: "+JSON.stringify(data.errorMessage) +", errorStackTrace:" +JSON.stringify(data.errorStackTrace));           
			        }
		        },
		        error: function (request, status, error) {
		        	// 실패처리
		            alert("error : " + JSON.stringify(error)); 
		            return;
		        	//console.log("data 실패 ???==> " + JSON.stringify(data));
		        	//console.log("??==> " + p_bizcomponentid);
		        	//console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
		        }
		    }); 
	 }, 
	/*******************************
	 * description : Stored Procedure none 호출 함수
	 * parameter1  : List를 받아서 selectbox만들기
	 * return      : return 된 json 또는 에러 
	 * p_selectboxid, p_list, p_sub_code, p_code_name, p_defaultvalue, p_allyn, p_disabled
	 ********************************/
	 setselectboxNoSql function(p_column) { 
	    var selectObj = p_column;
	    var p_column_name, p_list, p_sub_code, p_code_name, p_defaultvalue, p_allyn, p_disabled; 
	    p_column_name = selectObj.colName; 
	    p_list = selectObj.list; //key:value형태의 list구성
	    p_sub_code = selectObj.subCode; 
	    p_code_name = selectObj.codeName; 
	    p_defaultvalue = selectObj.defaultValue; 
	    p_allyn = selectObj.allYn; 
	    p_disabled = selectObj.disbled;
	    if (fnCheckString.isEmpty(p_disabled)) p_disabled = false;
	
	    var $selectBox = $('#' + p_selectboxid);
	 
	    var rs = p_list;
	    //JSON.stringify(data.list); 
	    if (p_allyn=="Y")
	    {
	      var obj = {};
	      obj[p_sub_code] = "";
	      obj[p_code_name] = "전체";
	      rs.unshift(obj); 
	    }
	    //console.log("rs==? "+JSON.stringify(rs));
	    if (lenData > 0)
	    {
	       var pOption = "";
	       for (var i=0; i<lenData; i++){
	       	if (rs[i][p_sub_code] ==  p_defaultvalue)
	       	{
	       		pOption += "<option value=\""+rs[i][p_sub_code]+"\" selected=\"selected\">"+rs[i][p_code_name]+"</option>";
	       		//console.log("pOption : " + pOption);
	       	}
	       	else
	   		{
	       	  pOption += "<option value=\""+rs[i][p_sub_code]+"\">"+rs[i][p_code_name]+"</option>";
	       	 //console.log("pOption : " + pOption);
	   		}
	       }
	       $selectBox.append(pOption);  
	   }
	   if (p_disabled==true){
	   	 $selectBox.attr("disable","true"); 
	    } 
	},
	
	/*******************************
	 * description : Stored Procedure 호출 함수
	 * parameter1  : Bizcomponent 가져와서 selectbox 일괄 만들기
	 * return      : return 된 json 또는 에러 
	 ********************************/
	setselectboxAll : function( p_work_type, p_param, p_column){
		var totalCount = p_column.length;
		var fieldArray = p_column;
		var selectObj = {};
		var paramObj = p_param;
		 for (i = 0; i < totalCount; i++) {
		  selectObj = fieldArray[i]; 
		  paramObj.listBoxId =fieldArray[i].listboxId;
		  paramObj.whereClause =fieldArray[i].whereClause; 
		 // console.log("selectObj : " + fieldArray[i].listboxId +"."+ JSON.stringify(selectObj));
		  this.setselectboxWithSql( p_work_type, paramObj, selectObj);  
		 }
	 },
     columnSelectBoxWithSql : function(p_work_type, p_param,  p_column) {  
 	    var selectObj = p_column;
 	    var p_grid_name, p_column_name, p_sub_code, p_code_name, p_defaultvalue, p_allyn, p_disabled; 
 	    p_grid_name = selectObj.gridName;
 	    p_column_name = selectObj.colName; 
 	    p_sub_code = selectObj.subCode; 
 	    p_code_name = selectObj.codeName; 
 	    p_defaultvalue = selectObj.defaultValue; 
 	    p_allyn = selectObj.allYn; 
 	    p_disabled = selectObj.isDisabled; 
 	    if (fnCheckString.isEmpty(p_disabled)) p_disabled = false; 
 	    var urlname = serverRoot + "common/call/nonatomic.do";
 	    var procedureName = "P_LISTBOX_Q";
 		var param = $.map(p_param, function(value,index){
 			return [value];
 		});  
 	   // var url = serverRoot + "common/listbox/list.do";
 		var parameters = {
 			"procedure": procedureName,
 			"workType": p_work_type,
 			"params": param
 		};  
 	
 	    var returnStr = [];
 	    var $gridName = $('#' + p_grid_name);
 	    //console.log("popdate ==> " + JSON.stringify(data));
 	    $.ajax({
 	        type: "POST",
 	        url: urlname,
 	        data: parameters,
 	        dataType: "json",
 	        success: function (data) {
 	        	// 성공처리 
 	        	//console.log("grid_data ==> " + JSON.stringify(data)); 
 	        	if (data.errorMessage == null) { 
 	              if (data.list==null)
 	              {
 	                alert("조회할 데이타가 없습니다.");
 	              }
 	              else { 
 	                var lenData = data.list.length;
 	                var rs = data.list;
 	                //console.log("data.list===>" + JSON.stringify(data.list));
 	                //console.log("p_allyn===>" + JSON.stringify(p_allyn));
 	                if (p_allyn=="Y")
 	                { 
 	                  var obj = {};
 	                  obj[p_sub_code] = "";
 	                  obj[p_code_name] = "전체";
 	                  rs.unshift(obj);
 	                }
 	                //console.log("rs==> "+JSON.stringify(rs));
 	                if (lenData > 0) { 
 	                   //$gridName.dxDataGrid("instance").columnOption(p_column_name, "lookup", { dataSource: rs, valueExpr: p_sub_code, displayExpr: p_code_name, value:p_default_value }); 
 	                  // $gridName.dxDataGrid("instance").refresh;
 	                	
 	                }  
 	              }
 	            }
 	            else{
 	               alert("errorMessage: "+JSON.stringify(data.errorMessage));
 	            }
 	            
 	        },
 	        error: function (request, status, error) {
 	        	return;
 	        	// 실패처리
 	        	//alert("err");
 	        	//console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
 	        }
 	    })  ;
 	}, 
 	// listObject로 값 생성 return하여 결과 생성
 	columnSelectBoxNoSql function(p_column) { 

 	    var selectObj = p_column;
 	    var p_column_name, p_list, p_sub_code, p_code_name, p_defaultvalue, p_allyn, p_disabled; 
 	    p_column_name = selectObj.colName; 
 	    p_list = selectObj.list; //key:value형태의 list구성
 	    p_sub_code = selectObj.subCode; 
 	    p_code_name = selectObj.codeName; 
 	    p_defaultvalue = selectObj.defaultValue; 
 	    p_allyn = selectObj.allYn; 
 	    p_disabled = selectObj.disbled;
 	    if (fnCheckString.isEmpty(p_disabled)) p_disabled = false;
 	    
 	    var $selectBox = $('#' + p_selectboxid);
 	 
 	    var rs = p_list;
 	    //JSON.stringify(data.list); 
 	    if (p_allyn=="Y")
 	    {
 	      var obj = {};
 	      obj[p_sub_code] = "";
 	      obj[p_code_name] = "전체";
 	      rs.unshift(obj); 
 	    }
 	    //console.log("rs==? "+JSON.stringify(rs));
 	    if (lenData > 0)
 	    {
 	       var pOption = "";
 	       for (var i=0; i<lenData; i++){
 	       	if (rs[i][p_sub_code] ==  p_defaultvalue)
 	       	{
 	       		pOption += "<option value=\""+rs[i][p_sub_code]+"\" selected=\"selected\">"+rs[i][p_code_name]+"</option>";
 	       		//console.log("pOption : " + pOption);
 	       	}
 	       	else
 	   		{
 	       	  pOption += "<option value=\""+rs[i][p_sub_code]+"\">"+rs[i][p_code_name]+"</option>";
 	       	 //console.log("pOption : " + pOption);
 	   		}
 	       }
 	       $selectBox.append(pOption);  
 	    }
 	    if (p_disabled==true){
 	      	 $selectBox.attr("disable","true"); 
 	       } 
 	    //var $gridName = $('#'+p_grid_name);
 	    //$gridName.dxDataGrid("instance").columnOption(p_column_name, "lookup", { dataSource: p_list, valueExpr: p_sub_code, displayExpr: p_code_name, value:p_default_value }); 
 	    //$gridName.dxDataGrid("instance").refresh; 
 	}, 
 	 
 	/*******************************
 	 * description : Stored Procedure 호출 함수
 	 * parameter1  : Bizcomponent 가져와서 selectbox 일괄 만들기
 	 * return      : return 된 json 또는 에러 
 	 ********************************/
 	columnsetselectboxAll : function( p_work_type, p_param, p_column){
 		var totalCount = p_column.length;
 		var fieldList = p_column;
 		var selectObj = {};
 		var paramObj = p_param;
 		 for (i = 0; i < totalCount; i++) {
 		  selectObj = fieldList[i]; 
 		  paramObj.listBoxId =fieldList[i].listboxId;
 		  paramObj.whereClause =fieldList[i].whereClause; 
 		  this.columnSelectBoxWithSql(p_work_type, paramObj, selectObj);  
 		 }
 	 }
};
 
























/*******************************************************************************************************************************
 * description : 화면페이지에 존재하는 세션값을 가지고 와서 변수로 사용
 ********************************************************************************************************************************/ 
function getsession() {
    var _session = {}; 
    _session = JSON.parse($("#session-key").val()); 
    return _session; 
}

/*******************************************************************************************************************************
 * description : 화면페이지에 존재하는 서버정보를 가지고 와서 변수로 사용
 ********************************************************************************************************************************/  
function getseverinfo() {
    var _serverinfo = ""; 
    _serverinfo = $("#session-server").val(); 
    return _serverinfo; 
} 
 
/*******************************************************************************************************************************
 * description : get방식의 파라미터를 읽어서 object로 전환하는데 이용
 ********************************************************************************************************************************/  
function getUriParams(){
	var params = {};
	window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) { params[key] = value; });
	return params;        	
} 

//menu_id값을 get string에서 받음
/*******************************************************************************************************************************
 * description : menu_id값을 get string에서 받음
 ********************************************************************************************************************************/  
function getMenuId()
{
    var oparams = getUriParams();
	var gMenuId = oparams.MENU_ID;	
	if (gMenuId==null)
	{
		gMenuId = "";
	 }
	return gMenuId;        	
} 

/*******************************
 * description : Json data 변환
 *******************************/
/*
function json {
    //parameter 추가로 인해 수정 (ekjeong)
    //var data = { "procedure": json.procedure, "names": [], "types": [], "sizes": [], "directions": [], "values": [], "nulls": [] };
    var data = { "procedure":  "empNoFieldName":json.empNoFieldName, "names": [], "types": [], "sizes": [], "directions": [], "values": [], "nulls": [] };
    

    var name, type, size, direction, value;
    //console.log(json.procedure);
    for (var i = 0; i < json.parameters.length; i++) {
    	//console.log(i + "___json.parameters.length == > " + json.parameters.length);
    	name = json.parameters[i].name;
    	
    	//console.log("name == > " + name);
    	if (name == null || name == "") {

            return null;
        }

        type = "";
        if (json.parameters[i].type != null) {
        	//console.log("type ");
        	for (var j = 0; j < _types.length; j++) {
        		//console.log("type2" + '//' + _types[j].toLowerCase() + '//' + json.parameters[i].type.toLowerCase());
            	if (_types[j].toLowerCase() == json.parameters[i].type.toLowerCase()) {
            		//onsole.log("type3");
            		type = _types[j]; 
                    break;
                }
            }
        }
        if (type == "") {
            return null;
        }
        //console.log("type ==>" + type);
        size = json.parameters[i].size;
        if (size == null) {
        	size = 0; 
        }

        direction = "";
        if (json.parameters[i].direction != null) {
            for (var j = 0; j < _directions.length; j++) {
            	if (_directions[j].toLowerCase() == json.parameters[i].direction.toLowerCase()) {
            		direction = _directions[j]; 
                    break;
                }
            }
        }
        if (direction == "") {
            direction = "Input";
        }

        var value = json.parameters[i].value;
        var isnull = 0;
        if (value == null) {
            value = "";
            isnull = 1;
        }
        

        //console.log("value==> " + value);

        data.names.push(name);
        
        data.types.push(type);
        
        data.sizes.push(size);
        
        data.directions.push(direction);
        
        data.values.push(value);
        
        data.nulls.push(isnull); 
        
        //console.log("data??" + JSON.stringify(data));
    }
    //console.log("dats는 ?" + JSON.stringify(data));
    return data;
}
*/

/*******************************
 * description : returnMessage 호출 함수
 * parameter1  : parameter code
 * return      : return 된 json 또는 에러 
 ********************************/ 
function gf_getMessage(
  p_work_type
, p_client_code
, p_lang_id
, p_error_type 
, p_error_code 
) {
 var url = serverRoot + "common/applMessage/list.do";
 var json = { 
  		"workType": p_work_type,
  		"clientCode": p_client_code,
  		"langId": p_lang_id,
  		"errorType": p_error_type,
  		"errorCode": p_error_code  
  	};
 
 var data = json;
 $.ajax({
     type: "POST",
     url: url,
     data: data,
     dataType: "json",
     success: function (data) {
         // 성공처리
         //alert(JSON.stringify(data));
         var rowcount = data.list.length;
         if (rowcount > 0) {
        	var strerrorStr = data.list[0].ERROR_STR;
            alert("message > " + p_error_code +" : " + JSON.stringify(strerrorStr));
         }
         else{
        	var strerrorStr = p_error_code + " : 등록된 메세지가 없습니다";
            alert("message > " + strerrorStr);
         }
     },
     error: function (request, status, error) {
     	// 실패처리
     	//alert("err");
     	//console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
     }
 });
} 
  
/*******************************
 * description : 메뉴권한체크
 * parameter1  : gf_userMenuAuth
 * return      : return 된 json 또는 에러 
 ********************************/
//메뉴권한체크용
function gf_userMenuAuth(menuId) 
  {
	var returnvalue = {};
	var suserid = session.USER_ID;
	var suserPc = session.USER_PC;
	if (suserPc==null)
		{
		suserPc = "ERP";
		}
    var menuparamObj = {
			"clientCode" : session.CLIENT_CODE,   //P_CLIENT_CODE
			"companyCode" : session.COMPANY_CODE,  //P_COMPANY_CODE
			"langId" : session.LANG_ID,  //p_lang_id
			"userIdP" : session.USER_ID, //p_user_id 
			"menuId" : menuId ,   //P_MENU_ID 
			"userId" : suserid,    //p_userid
			"userPc" : suserPc    //p_pc
    };   
    
    var urlname = serverRoot + "common/call/nonatomic.do";
    var procedureName = "P_GETACCESSAUTHQ";
	var param = $.map(menuparamObj, function(value,index){
		return [value];
	});  
   // var url = serverRoot + "common/listbox/list.do";
	var parameters = {
		"procedure": procedureName,
		"workType": "Q",
		"params": param
	};   
	 $.ajax({
	     type: "POST",
	     url: urlname,
	     data: parameters,
	     dataType: "json",
	     success: function (data) {
	         // 성공처리
	         //alert(JSON.stringify(data));
	    	 var res =  data.list;
	    	 if (res == null){
	    		 return;
	    	 }
	    	 else{
		         var rowcount = data.list.length;
		         if (rowcount > 0) {
		        	returnvalue = { 
						        	gViewAuth : data.list[0].FORM_VIEW_YN,
						        	gPrintAuth : data.list[0].FORM_PRINT_YN,
						        	gSaveAuth : data.list[0].FORM_SAVE_YN,
						        	gDeleteAuth : data.list[0].FORM_DELETE_YN, 
						        	gParameterInfo : data.list[0].PARAMETER_INFO
						          }; 
		         }
		        	//console.log("gDeleteAuth :" + gDeleteAuth );
		         }
		         else{
		        	//var strerrorStr =  data.errorCode + " : 등록된 메세지가 없습니다";
		            //alert("message > " + strerrorStr);
		        	 return; 
		         }
	    	 }
	     },
	     error: function (request, status, error) {
	         alert("error : " + JSON.stringify(error));
	         return; 
	     }
	 });
	return returnvalue;
}

/*******************************
 * description : form Default Layout 설정
 * parameter1  : 주요 layout의 margin, padding 설정 
 ********************************/
function gf_setFormLayout(){
 //parameter 정의
 var ibuttongroupClass = "p-2";
 var isearchgroupClass = "float-left mx-1";
 var icolumnitemClass = "float-left mx-1 mt-1 mb-0 p-0";
 var icardpClass = "round-lg shadow-none";
 var icolcolumnClass = "pl-1";
 var icardtablegroupClass = "p-0 m-0";
 var icardcontentClass = "p-2";
 var ifielditemClass = "mb-2"; 
 var ilabelClass="text-secondary font-weight-light"
 var ilabelrequireClass="text-primary font-weight-light"
 //setting
 $(".ibutton-group").addClass(ibuttongroupClass); 
 $(".isearch-item").addClass(isearchgroupClass); 
 $(".icolumn-item").addClass(icolumnitemClass); 
 $(".icard").addClass(icardpClass);  
 $(".icol-column").addClass(icolcolumnClass);
 $(".icard-table").addClass(icardtablegroupClass);
 $(".icard-content").addClass(icardcontentClass); 
 $(".ifield-item").addClass(ifielditemClass); 
 $(".ilabel").addClass(ilabelClass); 
 $(".ilabel-require").addClass(ilabelrequireClass); 
}

/*******************************
 * description : GridLayout 정의
 * description : 캡션정보를 이용하여 필드구성
 *******************************/

function gf_setGridHtml(vObjId, vColumns) { 
	var $gridName = $("#" + vObjId);
	var tableName = "tbl"+ vObjId;
	var $tableName = $("#" +tableName);
	var tableString = "";
	var theadString = "";
	var caption = "";
	tableString = "<table class=\"table table-hover table-striped display\" id=\""+tableName+"\"><thead>";
	var data = vColumns;
	//console.log("tableString :" + data);
	for (i = 0; i < data.length; i++) {
		var rowData = data[i];
		$.each(rowData, function() {
			  var key = Object.keys(this)[0];
			  var value = this[key]; 
		 }); 
		caption = rowData.caption;
	    theadString = theadString + "<th>" + caption + "</th>";
	}
	tableString = tableString + theadString ;
	tableString = tableString + "</thead></table>";
	//console.log("tableString :" + tableString);
	$gridName.html(tableString);
}

/*******************************
 * description : Grid 구성 정의용 변수
 *******************************/
function fnObjTableDef() { 
	var tableDef = { 
	        "data": "", 
	        "ajax": "", 
		    //"columns":vColumns,
	        "columnDefs": "",
	        "select":true,
	        "responsive": true,
	        "destroy": true,
	        "retrieve": true,
	        "autoWidth": false,
	        "searching": false,
	        "paging":   false,  
	        "info": false ,
	        "filter": false ,
	        "lengthChange": true ,
	        "stateSave": false ,
	        "scrollX": true ,
	        "scrollY": 200 ,
	        "scrollCollapse": true , 
	        "aDataSort": [[1, 'asc']]
	    } ;

    return tableDef;
} 


/********************************
 * description : column grid 속성 추가반영
 *  parameter1  :column 속성
 *  targets  : columns의 순서를 의미. 자동부여목적
 *  name  :column 이름. data의 값을 가지고 같이 사용할 수 있도록 자동 구성 
 *  배열내 객체값을 받아서 객체내 값 추가 --> parameter format : [{},{}}
 *******************************/
function gf_SetGridColPropery(vColumns){
	var vGridColObj = vColumns;
	for (var i = 0 ; i < vGridColObj.length; i++) {   
		vGridColObj[i].targets = i; 
		vGridColObj[i].name = vGridColObj[i].data;  
    }  
	return vGridCol;
} 

/********************************
 * description : DataTable Grid Layout 생성
 *******************************/
function gf_setGridLayout(vObjId, vColumns, vData) { 
	var vGridCol = gf_SetGridColPropery(vColumns);
	var $gridName = $("#" + vObjId);
	var tableName = "tbl"+ vObjId;
	var $tableName = $("#" +tableName);
	gf_setGridHtml(vObjId, vColumns);  
	var tableDef = fnObjTableDef();
	tableDef.columDefs = vGridCol;
	tableDef.data = vData;
	var table =  $tableName.DataTable(tableDef); 
	return table;
}

/********************************
 * description : DataTable Grid Layout 생성
 *******************************/
function gf_setGridLayout_View(vObjId, vColumns, vData) { 	
	var vGridCol = gf_SetGridColPropery(vColumns);
	var $gridName = $("#" + vObjId);
	var tableName = "tbl"+ vObjId;
	var $tableName = $("#" +tableName);
	
	//console.log("vGridCol:"+JSON.stringify(vGridCol));
	gf_setGridHtml(vObjId, vColumns);  
	var tableDef = fnObjTableDef();
	tableDef.columDefs = vGridCol;
	tableDef.data = vData;
	tableDef.filter = true;
	var table =  $tableName.DataTable(tableDef); 
	return table;
}

/********************************
 * description :DataTable  Grid Layout 생성
 *******************************/
function gf_setGridLayout_View2(vObjId, vColumns) {
	var $gridName = $("#" + vObjId);
	var tableName = "tbl"+ vObjId;
	var $tableName = $("#" +tableName);
	gf_setGridHtml(vObjId, vColumns);  
	var tableDef = fnObjTableDef();
	tableDef.columDefs = vColumns;
	tableDef.data = vData;
	tableDef.filter = true;
	var table =  $tableName.DataTable(tableDef); 
}

/*******************************
 * description : Stored Procedure 호출 함수
 * parameter1  : Bizcomponent 가져와서 selectbox 일괄 만들기
 * return      : return 된 json 또는 에러 
 ********************************/
function gf_setselectboxAll( p_work_type, p_param, p_column){
	var totalCount = p_column.length;
	var fieldArray = p_column;
	var selectObj = {};
	var paramObj = p_param;
	 for (i = 0; i < totalCount; i++) {
	  selectObj = fieldArray[i]; 
	  paramObj.listBoxId =fieldArray[i].listboxId;
	  paramObj.whereClause =fieldArray[i].whereClause; 
	 // console.log("selectObj : " + fieldArray[i].listboxId +"."+ JSON.stringify(selectObj));
	  gf_setselectboxWithSql( p_work_type, paramObj, selectObj);  
	 }
 }
/*******************************
 * description : Stored Procedure 호출 함수
 * parameter1  : Bizcomponent 가져와서 selectbox만들기
 * return      : return 된 json 또는 에러 
 ********************************/
//function gf_setselectboxWithSql(p_selectboxid, p_work_type, p_param, p_column, p_sub_code, p_code_name, p_defaultvalue, p_allyn, p_disabled) {
function gf_setselectboxWithSql( p_work_type, p_param, p_column) {
    var selectObj = p_column;
    var p_column_name, p_sub_code, p_code_name, p_defaultvalue, p_allyn, p_disabled; 
    p_column_name = selectObj.colName; 
    p_sub_code = selectObj.subCode; 
    p_code_name = selectObj.codeName; 
    p_defaultvalue = selectObj.defaultValue; 
    p_allyn = selectObj.allYn; 	  
   // console.log("p_sub_code : " + p_sub_code);
	//  console.log("p_code_name : " + p_code_name);
	//  console.log("p_allyn : " + p_allyn); 
    p_disabled = selectObj.isDisabled; 
    if (fnCheckString.isEmpty(p_disabled)) p_disabled = false;


    var urlname = serverRoot + "common/call/nonatomic.do";
    var procedureName = "P_LISTBOX_Q";
	var param = $.map(p_param, function(value,index){
		return [value];
	});  
   // var url = serverRoot + "common/listbox/list.do";
	var parameters = {
		"procedure": procedureName,
		"workType": p_work_type,
		"params": param
	}; 
    //console.log("호출전 data : " + JSON.stringify(data)); 
    //var selectlist = "";var $dialog = $('#' + settings.id);
    var $selectBox = $('#'+p_column_name);
    $.ajax({
        type: "POST",
        //url: serverRoot + "common/call/nonatomic.do",
        url: urlname,
        data: parameters,
        dataType: "json",
        success: function (data) {
            // 성공처리 
            //console.log("호출후 data : " + JSON.stringify(data));
            if (data.errorMessage == null) {
              if (data.list==null)
              {
                null;
                //alert("조회할 데이타가 없습니다.");
              }
              else{
               
                var rs = data.list;
              //  console.log("rs : " + JSON.stringify(data.list)); 
                if (p_allyn=="Y")
                {
                  var obj = {};
                  obj[p_sub_code] = "";
                  obj[p_code_name] = "전체";
                  rs.unshift(obj); 
                }
                var lenData = rs.length;
                //console.log("ledData : " + lenData);
                //console.log("rs==? "+JSON.stringify(rs));
                if (lenData > 0)
                {
                    var pOption = "";
                    for (var i=0; i<lenData; i++){
                    	if (rs[i][p_sub_code] ==  p_defaultvalue)
                    	{
                    		pOption += "<option value=\""+rs[i][p_sub_code]+"\" selected=\"selected\">"+rs[i][p_code_name]+"</option>";
                       		//console.log("pOption : " + pOption);
                    	}
                    	else
                		{
                    	  pOption += "<option value=\""+rs[i][p_sub_code]+"\">"+rs[i][p_code_name]+"</option>";
                          //console.log("pOption : " + pOption);
                		}
                    }
                    $selectBox.append(pOption);  
                }
                if (p_disabled==true){
                	 $selectBox.attr("disabled","true"); 
    	        }  
              }
	        }
	        else{
                alert("errorMessage: "+JSON.stringify(data.errorMessage) +", errorStackTrace:" +JSON.stringify(data.errorStackTrace));           
	        }
        },
        error: function (request, status, error) {
        	// 실패처리
            alert("error : " + JSON.stringify(error)); 
            return;
        	//console.log("data 실패 ???==> " + JSON.stringify(data));
        	//console.log("??==> " + p_bizcomponentid);
        	//console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        }
    }); 
}


/*******************************
 * description : Stored Procedure none 호출 함수
 * parameter1  : List를 받아서 selectbox만들기
 * return      : return 된 json 또는 에러 
 * p_selectboxid, p_list, p_sub_code, p_code_name, p_defaultvalue, p_allyn, p_disabled
 ********************************/
function gf_setselectboxNoSql(p_column) {

    var selectObj = p_column;
    var p_column_name, p_list, p_sub_code, p_code_name, p_defaultvalue, p_allyn, p_disabled; 
    p_column_name = selectObj.colName; 
    p_list = selectObj.list; //key:value형태의 list구성
    p_sub_code = selectObj.subCode; 
    p_code_name = selectObj.codeName; 
    p_defaultvalue = selectObj.defaultValue; 
    p_allyn = selectObj.allYn; 
    p_disabled = selectObj.disbled;
    if (fnCheckString.isEmpty(p_disabled)) p_disabled = false;

    var $selectBox = $('#' + p_selectboxid);
 
    var rs = p_list;
    //JSON.stringify(data.list); 
    if (p_allyn=="Y")
    {
      var obj = {};
      obj[p_sub_code] = "";
      obj[p_code_name] = "전체";
      rs.unshift(obj); 
    }
    //console.log("rs==? "+JSON.stringify(rs));
    if (lenData > 0)
    {
       var pOption = "";
       for (var i=0; i<lenData; i++){
       	if (rs[i][p_sub_code] ==  p_defaultvalue)
       	{
       		pOption += "<option value=\""+rs[i][p_sub_code]+"\" selected=\"selected\">"+rs[i][p_code_name]+"</option>";
       		//console.log("pOption : " + pOption);
       	}
       	else
   		{
       	  pOption += "<option value=\""+rs[i][p_sub_code]+"\">"+rs[i][p_code_name]+"</option>";
       	 //console.log("pOption : " + pOption);
   		}
       }
       $selectBox.append(pOption);  
   }
   if (p_disabled==true){
   	 $selectBox.attr("disable","true"); 
    } 
}


/*******************************
 * description : Stored Procedure 호출 함수
 * parameter1  : Bizcomponent 가져와서 selectbox 일괄 만들기
 * return      : return 된 json 또는 에러 
 ********************************/
function gf_ColumnsetselectboxAll( p_work_type, p_param, p_column){
	var totalCount = p_column.length;
	var fieldList = p_column;
	var selectObj = {};
	var paramObj = p_param;
	 for (i = 0; i < totalCount; i++) {
	  selectObj = fieldList[i]; 
	  paramObj.listBoxId =fieldList[i].listboxId;
	  paramObj.whereClause =fieldList[i].whereClause; 
	  gf_ColumnSelectBoxWithSql(p_work_type, paramObj, selectObj);  
	 }
 }
/*******************************
 * description : column lookup value 생성 기능
 *               Bizcomponent 가져와서 그리드 lookup value 생성하기
 * return      : return 된 json 또는 에러 
 * p_grid_name, p_column_name, p_sub_code, p_code_name, p_default_value, p_allyn
 ********************************/
function gf_ColumnSelectBoxWithSql(p_work_type, p_param,  p_column) { 

    var selectObj = p_column;
    var p_grid_name, p_column_name, p_sub_code, p_code_name, p_defaultvalue, p_allyn, p_disabled; 
    p_grid_name = selectObj.gridName;
    p_column_name = selectObj.colName; 
    p_sub_code = selectObj.subCode; 
    p_code_name = selectObj.codeName; 
    p_defaultvalue = selectObj.defaultValue; 
    p_allyn = selectObj.allYn; 
    p_disabled = selectObj.isDisabled; 
    if (fnCheckString.isEmpty(p_disabled)) p_disabled = false;

    var urlname = serverRoot + "common/call/nonatomic.do";
    var procedureName = "P_LISTBOX_Q";
	var param = $.map(p_param, function(value,index){
		return [value];
	});  
   // var url = serverRoot + "common/listbox/list.do";
	var parameters = {
		"procedure": procedureName,
		"workType": p_work_type,
		"params": param
	};  

    var returnStr = [];
    var $gridName = $('#' + p_grid_name);
    //console.log("popdate ==> " + JSON.stringify(data));
    $.ajax({
        type: "POST",
        url: urlname,
        data: parameters,
        dataType: "json",
        success: function (data) {
        	// 성공처리 
        	//console.log("grid_data ==> " + JSON.stringify(data)); 
        	if (data.errorMessage == null) { 
              if (data.list==null)
              {
                alert("조회할 데이타가 없습니다.");
              }
              else { 
                var lenData = data.list.length;
                var rs = data.list;
                //console.log("data.list===>" + JSON.stringify(data.list));
                //console.log("p_allyn===>" + JSON.stringify(p_allyn));
                if (p_allyn=="Y")
                { 
                  var obj = {};
                  obj[p_sub_code] = "";
                  obj[p_code_name] = "전체";
                  rs.unshift(obj);
                }
                //console.log("rs==> "+JSON.stringify(rs));
                if (lenData > 0) { 
                   //$gridName.dxDataGrid("instance").columnOption(p_column_name, "lookup", { dataSource: rs, valueExpr: p_sub_code, displayExpr: p_code_name, value:p_default_value }); 
                  // $gridName.dxDataGrid("instance").refresh;
                	
                }  
              }
            }
            else{
               alert("errorMessage: "+JSON.stringify(data.errorMessage));
            }
            
        },
        error: function (request, status, error) {
        	return;
        	// 실패처리
        	//alert("err");
        	//console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        }
    })  ;
}

 /*******************************
 * description : column lookup value 생성 기능
 *               Bizcomponent 가져와서 그리드 lookup value 생성하기
 * return      : return 된 json 또는 에러 
 * p_grid_name, p_column_name, p_list, p_sub_code, p_code_name, p_default_value
 ********************************/
function gf_ColumnSelectBoxNoSql(p_column) { 

    var selectObj = p_column;
    var p_column_name, p_list, p_sub_code, p_code_name, p_defaultvalue, p_allyn, p_disabled; 
    p_column_name = selectObj.colName; 
    p_list = selectObj.list; //key:value형태의 list구성
    p_sub_code = selectObj.subCode; 
    p_code_name = selectObj.codeName; 
    p_defaultvalue = selectObj.defaultValue; 
    p_allyn = selectObj.allYn; 
    p_disabled = selectObj.disbled;
    if (fnCheckString.isEmpty(p_disabled)) p_disabled = false;
    
    var $selectBox = $('#' + p_selectboxid);
 
    var rs = p_list;
    //JSON.stringify(data.list); 
    if (p_allyn=="Y")
    {
      var obj = {};
      obj[p_sub_code] = "";
      obj[p_code_name] = "전체";
      rs.unshift(obj); 
    }
    //console.log("rs==? "+JSON.stringify(rs));
    if (lenData > 0)
    {
       var pOption = "";
       for (var i=0; i<lenData; i++){
       	if (rs[i][p_sub_code] ==  p_defaultvalue)
       	{
       		pOption += "<option value=\""+rs[i][p_sub_code]+"\" selected=\"selected\">"+rs[i][p_code_name]+"</option>";
       		//console.log("pOption : " + pOption);
       	}
       	else
   		{
       	  pOption += "<option value=\""+rs[i][p_sub_code]+"\">"+rs[i][p_code_name]+"</option>";
       	 //console.log("pOption : " + pOption);
   		}
       }
       $selectBox.append(pOption);  
    }
    if (p_disabled==true){
      	 $selectBox.attr("disable","true"); 
       } 
    //var $gridName = $('#'+p_grid_name);
    //$gridName.dxDataGrid("instance").columnOption(p_column_name, "lookup", { dataSource: p_list, valueExpr: p_sub_code, displayExpr: p_code_name, value:p_default_value }); 
    //$gridName.dxDataGrid("instance").refresh; 
} 
 
/*******************************
* description : Excel Download
********************************/
function gf_ExcelDownload(vObjId, vFileName) {
    $("#" + vObjId).dxDataGrid({
        "export": { "enabled": false, "fileName": vFileName, "allowExportSelectedData": false }
    });

    $("#" + vObjId).dxDataGrid("instance").exportToExcel(false);
}

/*******************************
* description : Yes, No --> bool값으로 변경
********************************/
function gf_setIsYesNo(vParam) {
   if (vParam == "Y")
	   {
	   return true;
	   }
   else
	   {
	   return false;
	  }
}
/*******************************
* description : Yes, No --> bool값으로 변경
********************************/
function gf_setStrYesNo(vParam) {
   if (vParam == true)
	   {
	   return "Y";
	   }
   else
	   {
	   return "N";
	  }
}

function gf_Object2Array(vObject) {
  var vArray = $.map(vObject, function(value,index){
	return [value];
    })
   return vArray;
}

function gf_SetAjaxParam(P_URL_INFO, P_WORK_TYPE, P_PARAM){
	var param = gf_Object2Array(P_PARAM);
	var ajaxparamObj = {
	    urlname : P_URL_INFO.urlname,
	    procedureName : P_URL_INFO.procedureName, 
	    param :param, 
	    clientCode : P_PARAM.clientCode,
	    langId : P_PARAM.langId, 
	    parameters : {
			"procedure": P_URL_INFO.procedureName,
			"workType": P_WORK_TYPE,
			"params": param
	    }   
	}
	return ajaxparamObj;
}

 

/***********************************************
 * 사원 조회 팝업
 **********************************************/
function gf_popupEmployee(p_obj, p_compCode) {

    var v_objCode = p_obj + "_code";
    var v_objName = p_obj + "_name";
    var v_objBtn = p_obj + "_btn";


    $("#" + v_objBtn).click(function () {
        var emp_no_search = $("#" + v_objCode).dxTextBox("instance").option('value');
        var searchText = "";
        var replaceText = "searchText-";
        var replaceText1 = "searchText-0";
        if (emp_no_search == "") {
            searchText = "";
        }
        else {
            searchText = emp_no_search;
        }
        //var strWhereClause = "and x.dept_code like'"+dept_code_search+"'||'%' and x.emp_no like'"+replaceText1+"'||'%'";
        var strWhereClause = "";
        lookUpBox({ //lookupbox-custom.js
            title: "직원 조회",
            CompCode: p_compCode,
            bizcomponentid: "P_HRI001_ESS",
            whereclause: strWhereClause,
            postData: null,
            replaceChar: replaceText,
            searchParamCaptions: ["사번", "직원명"],
            searchParamValues: [searchText, ""],
            searchButtonText: "조회",
            url: serverRoot + "common/call/nonatomic.do",
            width: 650,
            onItemSelected: function (data) {
                $("#" + v_objCode).dxTextBox({
                    value: data.emp_no
                });
                $("#" + v_objName).text(data.emp_name);
            },
            searchText: searchText,
            tableHeader: ["사번", "직원명", "부서코드", "부서명", "사업장명", "직위명"],
            //tableHeader: ["사번", "직원명", "부서코드", "부서명", "사업장코드","사업장명","직위코드","직위명"],
            tableColumn: ["EMP_CODE", "EMP_NAME", "DEPT_CODE", "DEPT_NAME", "SITE_NAME", "POSITION_NAME"],
            //tableColumn: ["emp_no", "emp_name",  "dept_code", "dept_name","site_code","site_name","position_code","position_name"],
            searchField: ["DEP_CODE", "EMP_CODE"]
        })
    });
}


/*******************************
 * description : Columns data 변환
 *******************************/
function json2columns(json) {
    var columns = { "dataField": [], "caption": [], "alignment": [] };

    var dataField, caption, alignment;

    //alert(json.parameters.length);
    for (var i = 0; i < json.parameters.length; i++) {
        dataField = json.parameters[i].dataField;
        if (dataField == null || dataField == "") {
            return null;
        }

        caption = json.parameters[i].caption;
        if (caption == null || caption == "") {
            caption = dataField;
        }

        alignment = json.parameters[i].alignment;
        if (alignment == null || alignment == "") {
            return null;
        }

        columns.dataField.push(dataField);
        columns.caption.push(caption);
        columns.alignment.push(alignment);
    }

    return columns;
}
 
/********************************
 * description : 버튼그룹 Setting
 *  parameter1  : 1236 : 1,2,3,6 버튼 생성 
 *  (1 : 입력, 2 : 수정, 3 : 삭제, 4 : 조회, 5 : Excel, 6 : 출력/발급)
 *  (7 : 행추가, 8 : 행삭제, 9 : 저장, A : 확인, B : 새로고침, C : 반려)
 *  (R : 소급인쇄 Radio
 *  parameter2  : 생성위치 - R(오른쪽)/L(왼쪽
 *******************************/
function gf_setBtnGroup(buttonObj, position) {
    var  sButtonItem, sType, sName, sClass, sId;
    var t=buttonObj.length-1, j=0;
   // console.log(buttonObj.length);
    sButtonItem = "";
    sButtonItem += "<div class=\"ibutton-box clearfix\">";
    if (fnCheckString.isEmpty(position)) { position ="R";};
    //console.log("position : " + position);
    if (position=="L"){
	    for (var i = 0 ; i < buttonObj.length; i++) {  
	    	sName = buttonObj[i].buttonName; 
	    	sClass = "btn btn-item w-10 " + buttonObj[i].buttonClass+" float-left mx-1"; 
	    	sId = buttonObj[i].buttonId; 
	       sButtonItem += "<button type=\"button\" class=\""+sClass+"\" id=\""+sId+"\">"+sName+"</button>";   
	    }  
    }
    else{

        for (var i = 0 ; i < buttonObj.length; i++) {  
        	j = t - i;
        	sName = buttonObj[j].buttonName; 
        	sClass = "btn ibutton-item w-10 " + buttonObj[j].buttonClass+" float-right mx-1"; 
        	sId = buttonObj[j].buttonId; 
           sButtonItem += "<button type=\"button\" class=\""+sClass+"\" id=\""+sId+"\">"+sName+"</button>";   
        }  
    }
    sButtonItem += "</div>";
    //console.log("sButtonItem :" + sButtonItem);
    return sButtonItem;
}

/********************************
 * description : 검색항목구성 Setting(복잡한 태그를 자동으로 구성) 
 *******************************/
function gf_SetSearchItemTag(){ 
    /*초기값 셋팅 */ 
	$('.isearch-item').each(function(i){   
	      // console.log("["+i+"번째]: "+$(this).text()); 
	      var columnRequire = "";
	     if ($(this).attr("data-require") =="Y"){
	    	 columnRequire ="ilabel-require";
	  	 }
	  	 else{
	  		columnRequire ="ilabel";
	  	 }
	    var searchItemObj = {
	       columnId:$(this).attr("data-column"),
	       columnLabel:$(this).attr("data-label"),
	       columnRequire:columnRequire,
	       columnType:$(this).attr("data-type"),
	       columnLength:$(this).attr("data-length") 
	       };
	//	 console.log("vColumnLabelRequire1 :" + $(this).attr("data-require"));
	//	 console.log("vColumnLabelRequire2 :" + columnRequire);
	    var searchItem = gf_setSearchItemStr(searchItemObj);
	    $(this).append(searchItem);
	}); 
}
/********************************
 * description : 검색항목구성 Setting(복잡한 태그를 자동으로 구성) 
 *******************************/
function gf_setSearchItemStr(pColumObj) {
	 var vColumnObj = pColumObj;
	 var sSearchItem = "";
	 var vColumnLabelRequire = "";
	 var vColumnId = vColumnObj.columnId , 
	     vColumnLabel = vColumnObj.columnLabel,
	     vColumnType = vColumnObj.columnType,
	     vColunmRequire = vColumnObj.columnRequire,
	     vColumnLength =vColumnObj.columnLength; 
	// console.log("vColunmRequire :" + vColunmRequire);
	 sSearchItem += "<label for=\""+vColumnId+"\" class=\"" + vColunmRequire + "\">" + vColumnLabel+"</label>" ;  
	 sSearchItem += "<div class=\"input-group ifield-item " + vColumnLength + "\">" ;
	 sSearchItem += "<div class=\"input-group-prepend\">" ;
	 sSearchItem += "<span class=\"input-group-text\"><i class=\"fas fa-check\"></i></span>"; 
	 sSearchItem += "</div>" ;
	 if (vColumnType=="select"){
	    sSearchItem += "<select class=\"search-ddl form-control\" id=\""+vColumnId+"\"></select>" ;
	 }
	 else if (vColumnType=="text"){
		sSearchItem += "<input type=\"text\" class=\"search-ddl form-control\" id=\""+  vColumnId + "\" placeholder=\"\">"; 
	 }
	 else if (vColumnType=="date"){
		sSearchItem += "<input type=\"text\" class=\"search-ddl form-control\" id=\"" + vColumnId + "\">"; 
	}
	 sSearchItem += "</div>" ; 
	// console.log("sSearchItem :" + sSearchItem);
    return sSearchItem;
}

/********************************
 * description : 검색항목구성 Setting(복잡한 태그를 자동으로 구성) 
 *******************************/
function gf_SetFieldItemTag(){ 
    /*초기값 셋팅 */
	//var countSearch = $('.icolum-item').length; 
	$('.icolumn-item').each(function(i){   
     //  console.log("["+i+"번째]: "+$(this).text()); 
	      var columnRequire = "";
		     if ($(this).attr("data-require") =="Y"){
		    	 columnRequire ="ilabel-require";
		  	 }
		  	 else{
		  		columnRequire ="ilabel";
		  	 }
	    var fieldItemObj = {
	       columnId:$(this).attr("data-column"),
	       columnLabel:$(this).attr("data-label"),
	       columnRequire:columnRequire,
	       columnType:$(this).attr("data-type"),
	       columnLength:$(this).attr("data-length")
	       };
		// console.log("vColumnLabelRequire1 :" + $(this).attr("data-require"));
		// console.log("vColumnLabelRequire2 :" + columnRequire);
	    var fieldItem = gf_setFieldItemStr(fieldItemObj);
	    $(this).append(fieldItem);
	}); 
}
/********************************
 * description : 필드항목 구성 --> 세부태그 자동 생성용
 *******************************/
function gf_setFieldItemStr(pColumObj) {
	 var vColumnObj = pColumObj;
	 var sFieldItem = "";
	 var vColumnLabelRequire = "";
	 var vColumnId = vColumnObj.columnId , 
	     vColumnLabel = vColumnObj.columnLabel,
	     vColumnType = vColumnObj.columnType,
	     vColunmRequire = vColumnObj.columnRequire,
	     vColumnLength =vColumnObj.columnLength;
	  
	 sFieldItem += "<div class=\"form-group field-group icolumn-item\"</div>" ;  
	 sFieldItem += "<label for=\""+vColumnId+"\" class=\"" + vColunmRequire + "\">" + vColumnLabel + "</label>" ;  
	 sFieldItem += "<div class=\"input-group ifield-item "+ vColumnLength + "\">" ;
	 //var sFieldItem += "<div class=\"input-group-prepend\">" ;
	 //var sFieldItem += "<span class=\"input-group-text\"><i class=\"fas fa-check"\"></i></span>"; 
	 //var sFieldItem += "/div>" ;
	 if (vColumnType=="select"){
		 sFieldItem += "<select class=\"form-control\" id=\"" + vColumnId + "\"></select>" ;
	 }
	 else if (vColumnType=="text"){
		sFieldItem += "<input type=\"text\" class=\"form-control\" id=\"" + vColumnId + "\" name=\"" + vColumnId + "\" placeholder=\"\">"; 
	 }
	 else if (vColumnType=="checkbox"){
		sFieldItem += "<input type=\"checkbox\" class=\"form-check-input form-control\" id=\"" + vColumnId + "\">"; 
	}
	 else if (vColumnType=="date"){
		sFieldItem += "<input type=\"text\" class=\"form-control\" id=\"" + vColumnId + "\">"; 
	}
	 sFieldItem += "</div>" ; 
	 //console.log("sFieldItem :" + sFieldItem);
    return sFieldItem;  
} 

/***********************************************
* getParameter 값 가져오기
************************************************/
function setChildParamer(v_p_dataid, v_p_param){
  var temp = location.href.split("?");
  var return_value = "";
  if (temp != ""){
    var parameters = temp[1].split("&");
    if (parameters != ""){
       var lenParam = parameters.length;
       for (var i = 0; i < lenParam ; i++){
         var param = parameters[i].split("=");
         if (param[0]==v_p_param){
           return_value = param[1];
           }
         }
      }
    }
    else
    {
      return_value = "";
    }
  //alert ("return_value : " + return_value);
  var $childparam = $("input[type=hidden]#"+v_p_dataid);
  $childparam.val(return_value); 
} 

/***********************************************
* Hidden 변수 생성
************************************************/
function createHidden(v_Name, v_Value) {
    var sElement = document.createElement("input");

    sElement.type = "hidden";
    sElement.name = v_Name;
    sElement.id = v_Name;
    sElement.value = v_Value;

    return sElement;
}

/***********************************************
* Alpha format
************************************************/
function gf_fillZeros(n, digits) {  
    var zero = '';  
    n = n.toString();  

    if (n.length < digits) {  
        for (i = 0; i < digits - n.length; i++)  
            zero += '0';  
    }  
    return zero + n;  
} 


/***********************************************
* 날짜포맷정의
************************************************/
 function getDateFormat(p_date, p_format){ 
	var year = p_date.getFullYear();                                 //yyyy 
	var month = (1 + p_date.getMonth());                     //M 
	month = month >= 10 ? month : '0' + month;     // month 두자리로 저장 
	var day = p_date.getDate();                                        //d  
	day = day >= 10 ? day : '0' + day;                            //day 두자리로 저장 
	if (p_format=="yyyymmdd")
	{
	  return  year + '' + month + '' + day; 
	}                            //day 두자리로 저장 
	else if (p_format=="yyyy/mm/dd")
	{
	  return  year + '/' + month + '/' + day; 
	}                            //day 두자리로 저장 
	else if (p_format=="yyyy-mm-dd")
	{
	  return  year + '-' + month + '-' + day; 
	}
	else if (p_format == "yyyy.mm.dd") {
	    return year + '.' + month + '.' + day;
	}
 }

/*******************************
* description : 달력생성
* return      : 달력 Object
********************************/
function gf_setCalendarBox(vObjId, vValue, vBool) {
    if (fnCheckString.isEmpty(vBool)) vBool = false;

    $("#" + vObjId).dxDateBox({
        type: "date",
        displayFormat: "yyyy-MM-dd",
        showClearButton: true,
        value: vValue,
        disabled: vBool
    });
}

/*******************************
* description : 연도생성
* return      : 연도 DropDownLst Object
********************************/
function gf_setYearBox(vObjId, vValue, vBool) {
    if (fnCheckString.isEmpty(vBool)) vBool = false;

    var now = new Date();
    var iyear = now.getFullYear() + 1;
    var aList = new Array();

    var sCode = "code";
    var sName = "name";
    var iCount = 10;

    for (i = 0; i < iCount; i++) {
        // 객체 생성 
        var data = new Object();
        iyear = iyear - 1;
        data.code = iyear;
        data.name = iyear + "년";

        aList.push(data);
    }

    gf_setselectboxNoSql(vObjId, aList, sCode, sName, vValue, "", vBool);
}

/*******************************
* description : 월 생성
* return      : 월 DropDownLst Object
********************************/
function gf_setMonthBox(vObjId, vValue, vBool) {
    if (fnCheckString.isEmpty(vBool)) vBool = false;

    var aList = new Array();
    var iMonth = 0;
    var sCode = "code";
    var sName = "name";
    var iCount = 12;

    for (i = 0; i < iCount; i++) {
        // 객체 생성 
        var data = new Object();
        iMonth = i + 1;
        iMonth = iMonth >= 10 ? iMonth : '0' + iMonth;
        data.code = iMonth;
        data.name = iMonth + "월";

        aList.push(data);
    }

    gf_setselectboxNoSql(vObjId, aList, sCode, sName, vValue, "", vBool);
}

/*******************************
* description : 년.월 생성
* return      : 년.월 DropDownLst Object
********************************/
function gf_setYearMonthBox(vObjId, vValue, vBool) {
    if (fnCheckString.isEmpty(vBool)) vBool = false;

    var aList = new Array();
    var now = new Date();
    var iyear = now.getFullYear();
    var iMonth = 0;
    var sCode = "code";
    var sName = "name";
    var iCount = 12;

    for (i = 0; i < iCount; i++) {
        // 객체 생성 
        var data = new Object();
        iMonth = i + 1;
        iMonth = iMonth >= 10 ? iMonth : '0' + iMonth;
        data.code = iyear+ '' +iMonth;
        data.name = iyear + '년 ' + iMonth + "월";

        aList.push(data);
    }

    gf_setselectboxNoSql(vObjId, aList, sCode, sName, vValue, "", vBool);
}

/*******************************
* description : 24시 생성
* return      : 24시 DropDownLst Object
********************************/
function gf_setHourBox(vObjId, vValue, vBool) {
    if (fnCheckString.isEmpty(vBool)) vBool = false;

    var aList = new Array();
    var iMonth = 0;
    var sCode = "code";
    var sName = "name";
    var iCount = 24;

    for (i = 0; i < iCount; i++) {
        // 객체 생성 
        var data = new Object();
        iMonth = i 
        iMonth = iMonth >= 10 ? iMonth : '0' + iMonth;
        data.code = iMonth;
        data.name = iMonth + "시";

        aList.push(data);
    }

    gf_setselectboxNoSql(vObjId, aList, sCode, sName, vValue, "", vBool);
}

/*******************************
* description : 00,30분 생성
* return      : 분 DropDownLst Object
********************************/
function gf_setminuteBox(vObjId, vValue, vBool) {
    if (fnCheckString.isEmpty(vBool)) vBool = false;

    var aList = new Array();
    var iMonth = 0;
    var sCode = "code";
    var sName = "name";
    var iCount = 12;

    // 객체 생성 
    var data = new Object();

    data.code = session.CLIENT;
    data.name = "00분";
    aList.push(data);

    // 객체 생성 
    var data = new Object();

    data.code = "30";
    data.name = "30분";
    aList.push(data);

    gf_setselectboxNoSql(vObjId, aList, sCode, sName, vValue, "", vBool);
}
 
/*******************************
* description : 달력형식 변환
* return      : yyyy-MM-dd
********************************/
function gf_getDate(vDate) {
    if (fnCheckString.isEmpty(vDate)) return "";

    var sData = new Date(vDate);

    if (vDate.length == 8) return vDate;
    else if (vDate.length == 10) {
        vDate = vDate.replace(/-/gi, '');
        vDate = vDate.replace(/./gi, '');
        return vDate;
    } else return gf_setFormatDate(sData);
}

/*******************************
* description : Date Type 연도 추출
* return      : yyyy
********************************/
function gf_getYear(date) {
    var year = date.getFullYear();

    return year;
}

/*******************************
* description : Date Type 월 추출
* return      : mm
********************************/
function gf_getMonth(date) {
    var month = (1 + date.getMonth());                     //M 
    month = month >= 10 ? month : '0' + month;     // month 두자리로 저장 
    return month;
}

/*******************************
* description : 달력형식 변환
* return      : yyyy-MM-dd
********************************/
function gf_setFormatDate(date) {
    var year = date.getFullYear();                                 //yyyy 
    var month = (1 + date.getMonth());                     //M 
    month = month >= 10 ? month : '0' + month;     // month 두자리로 저장 
    var day = date.getDate();                                        //d  
    day = day >= 10 ? day : '0' + day;                            //day 두자리로 저장 
    return year + '' + month + '' + day;
}

/*******************************
* description : 오늘 날자 가져오기
* return      : yyyyMMdd
********************************/
function gf_getToday() {
    var now = new Date();
    var sToday;
    sToday = gf_setFormatDate(now);

    return sToday;
}

/***********************************************
* 날짜포맷정의
************************************************/
function getNowTimeStamp() {  
    var d = new Date();  

    var s = gf_fillZeros(d.getFullYear(), 4) + '-' +
            gf_fillZeros(d.getMonth() + 1, 2) + '-' +
            gf_fillZeros(d.getDate(), 2) + ' ' +
      
            gf_fillZeros(d.getHours(), 2) + ':' +
            gf_fillZeros(d.getMinutes(), 2) + ':' +
            gf_fillZeros(d.getSeconds(), 2);

    return s;  
}
function getNowDateStamp() {
    var d = new Date();

    var s = gf_fillZeros(d.getFullYear(), 4) + '-' +
        gf_fillZeros(d.getMonth() + 1, 2) + '-' +
        gf_fillZeros(d.getDate(), 2)  
    //console.log(s);
    return s;
}  
 
/***********************************************
* Search Popup
************************************************/
 function gf_getIP() {
     var sIPAddress;

     $(function () {
         $.getJSON("https://api.ipify.org?format=jsonp&callback=?",
           function (data) {
               alert("??"+JSON.stringify(data));
               sIPAddress = data.ip;
           }
         );
     });
     return sIPAddress;
 }

/***********************************************
* 문자열이 빈 문자열인지 체크하여 결과값을 리턴한다.
* @param str : 체크할 문자열
************************************************/
 function isEmpty(str) {
     if (typeof str == "undefined" || str == null || str == "")
         return true;
     else
         return false;
 }

 /***********************************************
 * 앞의 문자열이 빈 문자열인지 체크하여 빈문자이면 뒤에 값으로 취환
 * @param str : 체크할 문자열
 ************************************************/
 function isEmptyReplace(str_A, str_B) {
     var num_str;

     if (typeof str_A == "undefined" || str_A == null || str_A == "") {
         return str_B;
     } else {
         str_A = str_A.toString();
         if (str_B == 0 || str_B == "0" || str_B == 1 || str_B == "1") num_str = str_A.replace(/,/gi, "");
         else num_str = str_A;
         return num_str;
     }
 }

 /***********************************************
 * Date Format
 * @param str : yyyyMMdd
 * @return : yyyy.mm.dd
 ************************************************/
 function setyyyyMMdd(str) {
     if (fnCheckString.isEmpty(str)) str = "";
     else {
         str = str.substring(0, 4) + "." + str.substring(4, 6) + "." + str.substring(6, 8);
     }
     return str;
 }
 
 /***********************************************
 * Date Format
 * @param str : MMdd
 * @return : mm.dd
 ************************************************/
 function setMMdd(str) {
     if (fnCheckString.isEmpty(str)) str = "";
     else {
         str =  str.substring(4, 6) + "." + str.substring(6, 8);
     }
     return str;
 }

/************************************
 * File upload 파일.
 * p_source_type : Table 명 
 * p_source_code : Table Key
 * p_message : 성공 메세지 (없으면 Alert 창을 생성하지 않고 넘어감)
 * return : (성공 : true, 실패 : false) 
 ***********************************/
 function gf_fileUpload(p_client_code , p_company_code ,p_source_type, p_source_code, p_message , p_source_category , p_callfrom) {
    var sBool = false;
    var data = new FormData();
    //var files = $("input#AttachFile").get(0).files;
/*
     var sBool = false;
     var data = new FormData();
     //var files = $("input#AttachFile").get(0).files; 

     // 체크박스 배열 Loop 
	$("input[type=file]").each(function (idx) {

         // 해당 체크박스의 Value 가져오기
         var files = $(this).get(0).files;
		 //alert(files.length);
         if (files.length > 0) {
			
             sBool = true;
             data.append(("attachFile" + idx), files[0]); 
         }
     });
	//alert(sBool); 
     data.append("client_code", p_client_code);
     data.append("company_code", p_company_code);
     data.append("lang_id", "KO");
     data.append("user_id", session.USERID); 
     data.append("source_type", p_source_type);
     data.append("source_code", p_source_code);
     data.append("source_category", p_source_category);
     data.append("callfrom", p_callfrom);

*/

    // 체크박스 배열 Loop 
	
    $("input[type=file]").each(function (idx) { 
        // 해당 체크박스의 Value 가져오기
        var files = $(this).get(0).files; 
        if (files.length > 0) { 
            sBool = true;
            data.append(("attachFile" + idx), files[0]);
			//  data.append(("attachFile" + idx), files[0]);  
        }
    });
      

    var json = {
     		"procedure": "p_hress4000_s",
     		"workType": p_work_type,
     		"params": [p_client_code
     				  ,p_company_code
     			      ,p_lang_id 
     				  ,p_source_type 
     				  ,p_source_code 
     				  ,p_source_no 
     				  ,p_source_category 
     				  ,p_callfrom  
     			      ,p_userid
     			      ,p_pc]  
     	};
    var data = json;
    //console.log("sBool  "+ sBool);
    //console.log("data  " + JSON.stringify(data));

	//alert("common file  "+JSON.stringify(data));
     if (sBool) {
         $.ajax({
             type: "POST",
             url: "/Common/JSONFileUpload",
             data: data,
             processData: false,
             contentType: false,
             success: function (response) { 
                //console.log("file upload");
                if (!fnCheckString.isEmpty(p_message)) alert(p_message);
                //console.log("첨부파일등록성공");
                opener.mf_btnSearch();
                window.close();
                return true;
            },
             error: function (request, status, error) {
             	// 실패처리
             	//alert("err");
             	//console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
             	alert("첨부파일등록실패!!!!");
             }
         });
     } else {
         opener.mf_btnSearch();
         //self.close();
         return true;
     }
 }

/************************************
 * File upload 생성
 * p_file_no : ('01', '02'...) 
 ***********************************/
 function gf_setFileBox(p_file_no) {
     var strHtml = "";
     
     strHtml = '<input class="upload-name" id="filename_' + p_file_no + '" value="파일선택" disabled="disabled"> <label for="ex_filename_' + p_file_no + '">업로드</label> <input type="file" id="ex_filename_' + p_file_no + '" class="upload-hidden">';

     $("#filebox_" + p_file_no).empty().append(strHtml);

     $("#ex_filename_" + p_file_no).on('change', function () { // 값이 변경되면 
         if (window.FileReader) { // modern browser 
             var filename = $(this)[0].files[0].name;
         } else { // old IE 
             var filename = $(this).val().split('/').pop().split('\\').pop(); // 파일명만 추출 
         }

         // 추출한 파일명 삽입 
         $("#filename_" + p_file_no).val(filename);
         //$(this).siblings('.upload-name').val(filename);
     });
 }

 /************************************
  * File upload 생성
  * p_file_no : ('01', '02'...) 
  ***********************************/
 function gf_setFileList(p_data) {
     var strHtml = "";

     strHtml = '<input class="upload-name" id="filename_' + p_file_no + '" value="파일선택" disabled="disabled"> <label for="ex_filename_' + p_file_no + '">업로드</label> <input type="file" id="ex_filename_' + p_file_no + '" class="upload-hidden">';

     $("#filebox_" + p_file_no).empty().append(strHtml);

     $("#ex_filename_" + p_file_no).on('change', function () { // 값이 변경되면 
         if (window.FileReader) { // modern browser 
             var filename = $(this)[0].files[0].name;
         } else { // old IE 
             var filename = $(this).val().split('/').pop().split('\\').pop(); // 파일명만 추출 
         }

         // 추출한 파일명 삽입 
         $("#filename_" + p_file_no).val(filename);
         //$(this).siblings('.upload-name').val(filename);
     });
 }

 /************************************
  * 첨부파일 오픈.
  * p_file_no : ('01', '02'...) 
  ***********************************/
 function gf_downloadFile(p_sourceType, p_sourceCode, p_fileName) {
     //window.open("../fileServer/" + p_sourceType + "/" + p_sourceCode + "/" + p_fileName , "file", "scrollbars = yes");
     window.open("../DocMan/" + p_sourceType + "/" + p_sourceCode + "/" + p_fileName, "file", "scrollbars = yes");
 }

 /***********************************************
 * Log Access
 ************************************************/
 function  gf_setEssLogAccess(vTop, vAction) { // 처음에 Home , Index
  
    var json = {
     		"procedure": "essaccesslog",
     		"workType": p_work_type,
     		"params": [p_client_code
     				  ,p_company_code
     			      ,p_lang_id 
     				  ,p_top_memu 
     				  ,p_left_menu 
     			      ,p_userid
     			      ,p_pc]  
     	};
 	//console.log("esslog ==> " + JSON.stringify(json)); 
     var data = json;
     
 	//console.log("esslog2 ==> " + JSON.stringify(data));
     $.ajax({
         type: "POST",
         url: "/Common/Gateway",
         data: data,
         dataType: "json",
         success: function (data) {
             // 성공처리
             //alert(JSON.stringify(data));
             //alert("정상적으로 처리되었습니다.");
         },
         error: function (request, status, error) {
         	// 실패처리
         	//alert("err");
         	//console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
         }
     });
 }
 
/***********************************************
* iframe Tab 이동시size 조정.
************************************************/
 function gf_frameSetHeight() {
     var ifrm_height = 0;
     var imain_height = 0;

     ifrm_height = eval(document.body.scrollHeight + 20);
     imain_height = ifrm_height + 150;

     parent.document.getElementById("frmTarget").style.height = ifrm_height + "px";
     parent.document.getElementById("main_contents").style.height = imain_height + "px";
 }


/***********************************************
* sesstion 종료 처리
************************************************/

function checkSession(){ 
	session = getsession();
    //alert(JSON.stringify(session)); 
  if (session.EMP_NO == null) {
      alert("세션이 만료 되었습니다.\n다시 접속하십시요.");
      try {
          parent.document.location.href = "/common/login.do";
      } catch(e) {
          document.location.href = "/common/login.do";
      } finally{

      }
  }
} 

 /***********************************************
 * 전화번호 유효성 체크
 ************************************************/
 function gf_checkPhoneNumber(p_num) {
     if (fnCheckString.isEmpty(p_num)) {
         //console.log("준"); 
         return "";
     }
 	var regExp1 = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;//mobile
 	var regExp2 = /^\d{2,3}-\d{3,4}-\d{4}$/; //일반전화
 	//console.log("regExp1==>" + regExp1);
 	//console.log("regExp2==>" + regExp2);
 	if (!regExp1.test(p_num) && !regExp2.test(p_num)) {
 		alert("잘못된 전화번호입니다. 숫자, - 를 포함한 숫자만 입력하십시오.");
 		return false
 	}
 	return true;
 }


/***********************************************
  * 화면 가운데 window.open
 ************************************************/
 function OpenWindow(page, name, width, height) {
 	var left = width > 1600 ? 0 : (screen.availWidth - width) / 2;
 	var top = height > 900 ? 0 : (screen.availHeight - height) / 2 - 10;
 	var option = 'scrollbar=yes, toolbar =no, resizable=yes, scrollbars=no, status=no ,location=no, menubar=no';
 	//	option 		+= ',titlebar=no,menubar=no,fullScreen=no';
 	option += ',width=' + width + ',height=' + height;
 	option += ',left=' + left + ',top=' + top;

 	var win = window.open(page, name, option);
 	return win;
 } 

 /*******************************************************************************************************************************
  * description : 실행할 프로그램들을 순차적으로 반영
  ********************************************************************************************************************************/  
 $(document).ready(function () {
	 //sesstion 담기
     session = getsession();
	 //서버정보 담기
     serverRoot = getseverinfo();
     //alert(JSON.stringify(session)); 
 
     //화면 menuid 설정하기
     gMenuId = getMenuId();
     
     //console.log("gMenuId2 : "+gMenuId);
 	//마우스 우측버튼 금지
     if ((location.host).indexOf("localhost") == -1) {
     	$(document).on('contextmenu', function () {
     		return false;
     	});
     }
     //화면 SearchItem tag 동적 생성
     gf_SetSearchItemTag();
     //화면 FieldItem tag 동적 생성
     gf_SetFieldItemTag();
     //화면 CSS 반영위한 bootstrap class 반영
     gf_setFormLayout();
 }); 

 /*******************************************************************************************************************************
  * description : 우측마우스 실행금지 처리
  ********************************************************************************************************************************/ 
 $(document).on("contextmenu dragstart selectstart",function(e){
     return false;
 }); 