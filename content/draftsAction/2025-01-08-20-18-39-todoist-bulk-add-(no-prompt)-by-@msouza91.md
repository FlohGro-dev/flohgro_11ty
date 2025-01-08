---
title: Todoist Bulk Add (No Prompt) by @msouza91
date: 2025-01-08T19:18:37.120Z
---
    
> DISCLAIMER: I don’t do JS, so please go easy on me, I just tried to combine some ideas and after some LLM shenanigans I got this working. I’m sure there are better ways to do this, but it solves my issue.
> 
> The idea is to just format the tasks specially multiple ones in the same project/label without having to pick for each one.
> 
> The labels have to be setup previously to be correctly placed on tasks, but that is alright.
> 
> This script is a Todoist task creation utility that processes a text draft to create multiple tasks with advanced formatting options. 
> 
> ## Core Features
> 
> **Project Assignment**  
> - Tasks can be assigned to projects using #projectname  
> - Default project can be set using #projectname on a separate line  
> - All subsequent tasks use the default project until changed
> 
> **Label Management**  
> - Default labels can be set using @label1,label2 on a separate line  
> - Individual tasks can override defaults with @label syntax  
> - When a task has explicit labels, they take precedence over defaults
> 
> **Task Parameters**  
> Each task can include additional parameters after – symbols:  
> - –note: Adds a description to the task  
> - –due: Sets the due date/time  
> - –pri: Sets priority (1-4)
> 
> **Language Support**  
> - Default language for due dates can be set using ++XX format (e.g., ++en)
> 
> ## Task Format
> 
> Tasks follow this structure:  
> `  
> [task content] #project @labels --parameter value  
> `
> 
> ## Example:
> 
> ### Changing the due language:
>     
>     
>     ++pt
>     @work,personal
>     Buy groceries @shopping --pri 1
>     Ligar para John @calls #personal --pri 4 --due hoje --note Remember to discuss project timeline
>     Marcar dentista @health --pri 2 --due amanhã
>     Revisar Documentos @work #personal --pri 3 --due "Proxima segunda"
>     
> 
> ### Using default language:
>     
>     
>     @work,personal
>     Buy groceries @shopping --pri 1
>     Call John @calls #personal --pri 4 --due tod--note Remember to discuss project timeline
>     Schedule dentist @health --pri 2 --due tomorrow
>     Review documents @work #personal --pri 3 --due "next monday"
>     
> 
> _Credit to @agiletortoise for Todoist integration guidance and @davenichols for parameter-based quick add implementation._

https://directory.getdrafts.com/a/2W4
