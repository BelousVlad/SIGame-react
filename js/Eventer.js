class Eventer{
	constructor()
	{
		this.events = [];
	}

	addEvent(selector, event)
	{
		this.events.push({	
			selector : selector,
			event : event
		});

	}
	checkAndRun(htmlObj,args)
	{
		for(let item of this.events)
		{

			if($(htmlObj).is(item.selector))
			{

				if (!item.event(args))
				{
					return false;
				}
			}
		}
		
	}



}