import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Result "mo:base/Result";

actor {

  type Task = { text: Text; completed: Bool };

  type Profile = {
    challengeId: Nat;
    challengeName: Text;
    currentDay: Nat;
    streak: Nat;
    points: Nat;
    badges: [Text];
  };

  type UserData = {
    var challengeId: Nat;
    var currentDay: Nat; // 1-30
    // 30 days * 3 tasks = 90 bools
    var completedTasks: [var Bool];
    var streak: Nat;
    var points: Nat;
    var badges: [Text];
  };

  let challengeNames : [Text] = [
    "30 Day Glow Up",
    "30 Day Fitness Reset",
    "30 Day Mental Health Reset",
    "30 Day Money Saving Challenge"
  ];

  // 4 challenges x 30 days x 3 tasks
  let taskData : [[[Text]]] = [
    // Glow Up
    Array.tabulate<[Text]>(30, func(d) {
      let day = d + 1;
      ["Drink 8 glasses of water", "Do a 10-min skincare routine", "Write 3 things you're grateful for"]
    }),
    // Fitness Reset
    Array.tabulate<[Text]>(30, func(d) {
      ["Do 20 push-ups", "Walk 7,000 steps", "Stretch for 10 minutes"]
    }),
    // Mental Health Reset
    Array.tabulate<[Text]>(30, func(d) {
      ["Meditate for 5 minutes", "Journal one page", "Spend 30 min screen-free"]
    }),
    // Money Saving
    Array.tabulate<[Text]>(30, func(d) {
      ["Track all spending today", "Skip one unnecessary purchase", "Review your budget"]
    })
  ];

  let users = HashMap.HashMap<Principal, UserData>(16, Principal.equal, Principal.hash);

  func getOrCreate(p: Principal) : UserData {
    switch (users.get(p)) {
      case (?u) u;
      case null {
        let u : UserData = {
          var challengeId = 0;
          var currentDay = 1;
          var completedTasks = Array.init<Bool>(90, false);
          var streak = 0;
          var points = 0;
          var badges = [];
        };
        users.put(p, u);
        u
      };
    }
  };

  func taskIndex(day: Nat, task: Nat) : Nat { (day - 1) * 3 + task };

  func allDoneForDay(u: UserData, day: Nat) : Bool {
    let base = (day - 1) * 3;
    u.completedTasks[base] and u.completedTasks[base+1] and u.completedTasks[base+2]
  };

  func checkBadge(u: UserData, day: Nat) {
    let milestones = [3, 7, 15, 30];
    let names = ["3-Day Starter", "7-Day Streak", "2-Week Warrior", "30-Day Champion"];
    var i = 0;
    for (m in milestones.vals()) {
      if (day == m) {
        // check not already added
        let already = Array.find<Text>(u.badges, func(b) { b == names[i] });
        if (already == null) {
          u.badges := Array.append(u.badges, [names[i]]);
        };
      };
      i += 1;
    };
  };

  public shared(msg) func getProfile() : async Profile {
    let u = getOrCreate(msg.caller);
    {
      challengeId = u.challengeId;
      challengeName = challengeNames[u.challengeId];
      currentDay = u.currentDay;
      streak = u.streak;
      points = u.points;
      badges = u.badges;
    }
  };

  public shared(msg) func selectChallenge(id: Nat) : async () {
    if (id >= 4) return;
    let u = getOrCreate(msg.caller);
    u.challengeId := id;
    u.currentDay := 1;
    u.completedTasks := Array.init<Bool>(90, false);
    u.streak := 0;
    u.points := 0;
    u.badges := [];
  };

  public shared(msg) func getTodayTasks() : async [Task] {
    let u = getOrCreate(msg.caller);
    let cid = u.challengeId;
    let day = u.currentDay;
    let dayTasks = taskData[cid][day - 1];
    Array.tabulate<Task>(3, func(i) {
      { text = dayTasks[i]; completed = u.completedTasks[taskIndex(day, i)] }
    })
  };

  public shared(msg) func markTask(taskIdx: Nat) : async () {
    if (taskIdx >= 3) return;
    let u = getOrCreate(msg.caller);
    let idx = taskIndex(u.currentDay, taskIdx);
    if (not u.completedTasks[idx]) {
      u.completedTasks[idx] := true;
      u.points += 10;
    };
  };

  public shared(msg) func advanceDay() : async Result.Result<Nat, Text> {
    let u = getOrCreate(msg.caller);
    if (not allDoneForDay(u, u.currentDay)) {
      return #err("Complete all tasks for today first!");
    };
    if (u.currentDay >= 30) {
      return #err("Challenge complete!");
    };
    u.streak += 1;
    checkBadge(u, u.currentDay);
    u.currentDay += 1;
    #ok(u.currentDay)
  };

}
