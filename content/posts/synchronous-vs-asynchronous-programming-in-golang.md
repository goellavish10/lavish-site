Synchronous and asynchronous programming has been a topic you understand when you build your medium-level backend applications alongside concepts how to increase the performance of your application.

## Asynchronous vs Synchronous

Synchronous programming, also known as blocking programming, follows a straightforward execution flow. In this model, each task or operation is executed one after the other, waiting for the completion of the previous task before moving on to the next. As a result, if a task takes a long time to complete, it will block the execution of subsequent tasks, causing potential delays in the overall program.

On the other hand, asynchronous programming allows tasks to be executed independently and concurrently. Instead of waiting for a task to complete, the program can continue executing other tasks while the asynchronous operations are running in the background. This non-blocking nature of asynchronous programming enables efficient utilization of system resources and facilitates responsiveness, particularly in scenarios where tasks involve waiting for I/O operations, such as network requests or file operations.

## Implementing Synchronous Code in Golang

Implementing Synchronous code is nothing but writing code just in the normal way and let it execute.

```
package main

import (
    "fmt"
    "time"
)

func main() {
    timeNow := time.Now()

    work1()
    work2()
    work3()
    work4()

    fmt.Println("Time taken to execute: ", time.Since(timeNow))
}

func work1() {
    time.Sleep(100 * time.Millisecond)
    fmt.Println("Work 1")
}
func work2() {
    fmt.Println("Work 2")
}
func work3() {
    time.Sleep(500 * time.Millisecond)
    fmt.Println("Work 3")
}
func work4() {
    time.Sleep(200 * time.Millisecond)
    fmt.Println("Work 4")
}
```

Above I implement a very simple synchronous code example. The `main` function executes 4 work functions which have a specific sleep time, which means that the execution stops for that particular time interval when the program reaches that line of code.

The `time` package in Golang helps us evaluate the total time elapsed in the execution of the function which gives us a good reference when we will compare it to the asynchronous version of the same program.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1687890128023/40c23820-488b-47ad-8793-86e3cf49c45d.png)

Now, if you execute the above program you would see something like this where the function executes and in the end, prints the time consumed to execute the program. You can observe how it executes the program in the manner it is written thus when the `work1()` stops execution for `100ms` it still waits for it to complete and then moves on to the next work function.

When I learnt my first ever Backend framework (Node.js) it took me a few months to correctly grasp the concept of Asynchronous and Synchronous Programming. So, recently when I had dived deep into learning Golang, I remembered that Node.js time and thought to implement the same in Golang (which is far easier to implement).

## Moving on to Asynchronous Programming in Go

Now we have observed our time-consuming functions and need to use asynchronous principles to optimise our application's performance.

### Goroutines

In Golang, it is fairly simple to implement Asynchronous programming. You just need to put `go` keyword in front of any `function` that you want to get executed asynchronously.

Example:

```
package main

import (
    "fmt"
    "time"
)

func main() {
    timeNow := time.Now()

    go work1()
    go work2()
    go work3()
    go work4()

    fmt.Println("Time taken to execute: ", time.Since(timeNow))
}

func work1() {
    time.Sleep(100 * time.Millisecond)
    fmt.Println("Work 1")
}
func work2() {
    fmt.Println("Work 2")
}
func work3() {
    time.Sleep(500 * time.Millisecond)
    fmt.Println("Work 3")
}
func work4() {
    time.Sleep(200 * time.Millisecond)
    fmt.Println("Work 4")
}
```

Yes, that's pretty much it! You've successfully implemented asynchronous code in Golang!

But wait when you execute it

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1687891325556/a23dc039-3d4a-4d1f-b00d-13e19775f31c.png)

You see nothing printed on your terminal window!! Why is that? That was my reaction when I just read a StackOverflow comment regarding how easy it is to implement Asynchronous Programming in Golang and then later remembered another concept about Concurrency vs Parallelism

### Concurrency vs Parallelism

Now this is a very important concept that needs to be understood for actually implementing the async golang function.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1687891608266/c26bd056-b9a8-47ff-98e6-f0892c153d08.jpeg)

This image can give you a basic idea of both terms.

In simplest terms, Parallelism means the execution of tasks parallel to each other. So, if you are watching Netflix and eating popcorn those are two tasks you are doing parallelly. So less total time is consumed to perform different tasks, but in most programming languages, we have the option to implement Concurrency and not Parallelism. Simply because Parallelism requires low-level control over the hardware of the computer and other highly critical kernel operations which is very difficult to implement, whereas Concurrency is a high-level concept and can be implemented using programming techniques.

Now, Concurrency is not executing multiple tasks together but handling of multiple tasks. For example: You start reading this blog and quickly realise it will take you at least half an hour to read and understand it properly, and there's an errand your mom assigned you which will take 5 minutes. So, ideally, you would pause the execution of the process where you are reading this blog but complete the errand because it takes lesser time.

Similarly, the processor when has multiple tasks it has, let's suppose a ticker, it goes through each task for the specific time defined in that ticker (say `1ms`). So, it would go over the list of tasks and executes a task for 1 ms, if it doesn't finish it moves to the next one and so on. In this fashion, it is managing but not completely executing the multiple tasks on the queue. This allows the execution of tasks which are faster earlier than the tasks which take time and provides a non-blocking experience to your application.

So this must've given you a basic idea about the concept of concurrency and parallelism.

Let's move to implement the solving the problem in our Asynchronous Golang Code.

### Why did the code above show no result?

Now, the first question you need answered is why exactly did Go code above didn't print anything at all.

So, when you started executing all the work functions using `go` the keyword they started executing on, what we call a `fork`. What actually happens is that any function with `go` the keyword in front of them goes to a separate **goroutine, and not necessarily a separate thread!**

_A Goroutine is nothing but lightweight threads implemented by Go runtime which leverage and get multiplexed over a small number of threads of CPU. The Go runtime has a scheduler which concurrently manages the execution of goroutines. Similar to schedulers in OS._

_A little complex, but for now let's focus on things from the top level._

So, when the function goes to a separate goroutine to execute the `main` thread where the `func main()` is executing keeps on going ahead with its execution and when it reaches the end of the code it finishes and exits and does not necessarily waits for all the other goroutines to complete their execution. And that is why the code did not print anything inside work functions as the `main` completed its execution without waiting for the goroutines (or functions you asked the golang runtime to execute asynchronously)

### Using WaitGroups to execute Async Code

Now to solve the problem of the main function not waiting we have wait groups from one of the most powerful packages built into Golang which is `sync`.

The code:

```
package main

import (
    "fmt"
    "sync"
    "time"
)

var wg = sync.WaitGroup{}

func main() {
    timeNow := time.Now()

    wg.Add(4)

    go work1()
    go work2()
    go work3()
    go work4()

    wg.Wait()

    fmt.Println("Time taken to execute: ", time.Since(timeNow))
}

func work1() {
    defer wg.Done()
    time.Sleep(100 * time.Millisecond)
    fmt.Println("Work 1")
}
func work2() {
    defer wg.Done()
    fmt.Println("Work 2")
}
func work3() {
    defer wg.Done()
    time.Sleep(500 * time.Millisecond)
    fmt.Println("Work 3")
}
func work4() {
    defer wg.Done()
    time.Sleep(200 * time.Millisecond)
    fmt.Println("Work 4")
}
```

So we have added a few lines, let's break them down one by one.

First, we make a global variable `wg` by importing `sync` package and utilizing the `WaitGroup{}` method on it.

Thus, `wg` contains an empty initialised `WaitGroup`

Then, inside the `main` function, we added `wg.Add(4)` simply indicating that we have **4** goroutines to wait for. Then inside each of the work functions, we added `defer wg.Done()` (we were able to use `wg` variable directly in the work functions as we declared it as a global variable if you defined `wg` variable inside the main function you would have to pass it by reference and manage the pointers). This `Done` method simply indicates that this particular subroutine has ended and execution is completed. The `defer` keyword makes sure that the line of code written in front of it is executed just before the execution of that particular function finishes. And, finally, the `wg.Wait()` indicates to the `main` thread that until the `WaitGroup` have all the **added subroutines** completed (which is indicated by receiving a notification on the execution of `wg.Done()`) till then the `main` function will not complete its execution.

Now, run this code and you'll have an interesting observation.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1687893705839/84a959fd-3ae2-4388-9853-c8199aa704b1.png)

The work functions are not executed in the order they are written but are executed in the order of the increasing time they needed to execute, but the total time to execute our program has reduced by **300ms!** It may seem low but when you will execute actual DB Queries, and API Requests this asynchronous method will help you deliver requests much faster and let you scale your server app much better.

## Conclusion

So with this, we reach the end of our tutorial for today. I think you must have your doubts about asynchronous and synchronous programming get cleared, but if not, fear not buddy! In your own time and don't hesitate to comment, or connect with me for any doubts, queries and/or any suggestions.

Cheers :)
