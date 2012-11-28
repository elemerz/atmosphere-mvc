package com.keaplogik.webapp.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.Callable;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import org.atmosphere.cpr.AtmosphereResource;
import org.atmosphere.cpr.AtmosphereResourceEvent;
import org.atmosphere.cpr.AtmosphereResourceEventListenerAdapter;
import org.atmosphere.cpr.Broadcaster;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.social.twitter.api.SearchResults;
import org.springframework.social.twitter.api.Tweet;
import org.springframework.social.twitter.api.impl.TwitterTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.keaplogik.webapp.model.Film;
import com.keaplogik.webapp.model.TwitterMessage;
import com.keaplogik.webapp.services.FeedService;

/**
 * Handles requests for the application home page.
 */
@Controller
public class HomeController {
	
	private static final Logger logger = LoggerFactory.getLogger(HomeController.class);
	
	private long sinceId = 0;
	
	@Autowired
	FeedService feedService;
	
	private void suspend(final AtmosphereResource resource) {
        final CountDownLatch countDownLatch = new CountDownLatch(1);
        resource.addEventListener(new AtmosphereResourceEventListenerAdapter() {
            @Override
            public void onSuspend(AtmosphereResourceEvent event) {
                countDownLatch.countDown();
                resource.removeEventListener(this);
            }
        });
        resource.suspend();
        try {
            countDownLatch.await();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
	
	/**
	 * Simply selects the home view to render by returning its name.
	 */
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String home(Locale locale, Model model) {
		logger.info("Welcome home! the client locale is "+ locale.toString());
		model.addAttribute("serverTime", feedService.formatDate(locale) );
		return "home";
	}
	
	@RequestMapping(value="/twitter/concurrency")
	@ResponseBody
	public void twitterAsync(AtmosphereResource atmosphereResource, @RequestBody final String clientData){
		final ObjectMapper mapper = new ObjectMapper();
	
		this.suspend(atmosphereResource);

        final Broadcaster bc = atmosphereResource.getBroadcaster();
        
        logger.info("Atmo Resource Size: " + bc.getAtmosphereResources().size());

//        bc.scheduleFixedBroadcast(new Callable<String>() {
//            
//
//            //@Override
//            public String call() throws Exception {
//
//                final TwitterTemplate twitterTemplate = new TwitterTemplate();
//                final SearchResults results = twitterTemplate.searchOperations().search("world", 1, 5, sinceId, 0);
//
//               //logger.info("sinceId: " + sinceId + "; maxId: " + results.getMaxId());
//
//                sinceId = results.getMaxId();
//                
//                List<TwitterMessage> twitterMessages = new ArrayList<TwitterMessage>();
//                
//                for (Tweet tweet : results.getTweets()) {
//                    twitterMessages.add(new TwitterMessage(tweet.getId(),
//                                                           tweet.getCreatedAt(),
//                                                           tweet.getText(),
//                                                           tweet.getFromUser(),
//                                                           tweet.getProfileImageUrl()));
//                }
//
//                return mapper.writeValueAsString(twitterMessages);
//            }
//
//        }, 10, TimeUnit.SECONDS);
        if(clientData == null || clientData.isEmpty()){
        	bc.broadcast(new Film("Mizerabilii"));
        }else{
        	int max=5;
        	for (int i = 0; i < max; i++) {
        		bc.broadcast(clientData + "- Back from server " + i + "/" + max);
        		try {
					Thread.sleep(1000);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
			}
        }
	}
	
}
