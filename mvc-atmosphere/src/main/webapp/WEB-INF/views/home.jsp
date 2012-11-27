<%@ include file="/WEB-INF/views/includes/taglibs.jsp"%>

<spring:url scope="page" var="inheritanceScriptUrl" value="/resources/js/inheritance-1.0.min.js"/>
<spring:url scope="page" var="jqueryJavascriptUrl" value="/resources/js/jquery-1.7.1.js"/>
<spring:url scope="page" var="jqueryTmplJavascriptUrl" value="/resources/js/jquery.tmpl.min.js"/>
<spring:url scope="page" var="jqueryAtmosphereUrl" value="/resources/js/jquery.atmosphere.js"/>
<spring:url scope="page" var="bootstrapUrl" value="/resources/js/bootstrap.js"/>
<spring:url scope="page" var="baseScriptUrl" value="/resources/js/base.js"/>
<spring:url scope="page" var="searchPageUrl" value="/resources/js/searchPage.js"/>
<spring:url scope="page" var="bootstrapCssUrl" value="/resources/css/bootstrap.css"/>
<spring:url scope="page" var="bootstrapResponsiveCssUrl" value="/resources/css/bootstrap-responsive.css"/>

<!DOCTYPE HTML>
<html>
    <head>

        <title>Welcome to Spring Web MVC - Atmosphere Sample</title>

        <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
		<link rel="stylesheet" href="${pageScope.bootstrapCssUrl}"/>
		<link rel="stylesheet" href="${pageScope.bootstrapResponsiveCssUrl}"/>
    </head>
    <body data-search-url='<c:url value='/twitter/concurrency'/>'>
    	<section id="view-twitter-feed">
	        <div class="container-fluid">
	        	<header class="page-header">
	                <h3>
	                    Twitter Demo w/ SpringMVC and Atmosphere 
	                </h3>
	            </header>
	        	<div class="row-fluid">
	        		<div class="span2">
		                <ul class="nav nav-list">
						  <li class="nav-header">
						    Select Transport
						  </li>
					      <li id="websockets-item">
					      	<a href="#">Websockets</a>
					      </li>
					      <li id="streaming-item" class="active">
					      	<a href="#">Streaming</a>
					      </li>
					      <li id="polling-item">
					      	<a href="#">Polling</a>
					      </li>
					      <li id="long-polling-item">
					      	<a href="#">Long Polling</a>
					      </li>
				        </ul>
				        <br />
				        <header class="nav-header">
	                        <h3>Stats</h3>
	                    </header>
		                <table id="chartableStats" class="table-condensed">
		                    <thead>
		                        <tr>
		                            <th scope="col"></th>
		                            <th scope="col"></th>
		                        </tr>
		                    </thead>
		                    <tbody>
		                        <tr>
		                            <th scope="row" style="color: #1751A7"># of Callbacks</th>
		                            <td id="numberOfCallbackInvocations">0</td>
		                        </tr>
		                        <tr>
		                            <th scope="row" style="color: #8AA717"># Tweets</th>
		                            <td id="numberOfTweets">0</td>
		                        </tr>
		                        <tr>
		                            <th scope="row" style="color: #A74217"># Errors</th>
		                            <td id="numberOfErrors">0</td>
		                        </tr>
		                    </tbody>
		                </table>
		            </div>
	        		<div class="span10">
	        			<input id='txtClientMsg' value='fromClient'/><button id='btnSendClientMsg'>Send</button><button id='btnAutoSender'>AutoSend</button>
		        		<table class="table-striped table-bordered">
			            	<thead>
		                        <tr>
		                            <th width="800">Twitter Messages</th>
		                        </tr>
		                    </thead>
		                    <tbody id="twitterMessages">
		                    	<tr id="placeHolder">
		                    		<td>Searching...</td>
		                    	</tr>
		                    </tbody>
		            	</table>
	        		</div>
	        	</div>
        	</div>
       	</section>
		
        <script id="template" type="text/x-jquery-tmpl">
        <tr>
			<td>
				<img align="left" alt='\${fromUser}' title='\${fromUser}' src='\${profileImageUrl}' width='48' height='48'>
					<div>
						&nbsp;&nbsp;&nbsp;<c:out value='\${text}'/>
					</div>
			</td>
		</tr>
        </script>
        
	
		<script src="${pageScope.inheritanceScriptUrl}"></script>
		<script src="${pageScope.jqueryJavascriptUrl}"></script>
		<script src="${pageScope.jqueryTmplJavascriptUrl}"></script>
		<script src="${pageScope.jqueryAtmosphereUrl}"></script>
		<script src="${pageScope.bootstrapUrl}"></script>
		<script src="${pageScope.baseScriptUrl}"></script>
		<script src="${pageScope.searchPageUrl}"></script>
    </body>
</html>
