package ro.isdc.controllers;

import java.util.Locale;
import java.util.concurrent.CountDownLatch;

import org.atmosphere.cpr.AtmosphereResource;
import org.atmosphere.cpr.AtmosphereResourceEvent;
import org.atmosphere.cpr.AtmosphereResourceEventListenerAdapter;
import org.atmosphere.cpr.Broadcaster;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Handles requests for the application home page.
 */
@Controller
public class WMCController {
	
	private static final Logger logger = LoggerFactory.getLogger(WMCController.class);
	
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
		return "home";
	}
	
	@RequestMapping(value="/search")
	@ResponseBody
	public void search(AtmosphereResource atmosphereResource, @RequestBody final String clientData){
		this.suspend(atmosphereResource);
        final Broadcaster bc = atmosphereResource.getBroadcaster();
        logger.info("Atmo Resource Size: " + bc.getAtmosphereResources().size());

        if(clientData == null || clientData.isEmpty()){
        	bc.broadcast("No client data received. Sending back Stephen Hawking...");
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
