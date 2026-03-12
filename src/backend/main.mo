import Int "mo:core/Int";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type ChallengeId = {
    #glowUp;
    #fitnessReset;
    #mentalHealth;
    #moneySaving;
  };

  module ChallengeId {
    public func compare(id1 : ChallengeId, id2 : ChallengeId) : Order.Order {
      switch (id1, id2) {
        case (#glowUp, #glowUp) { #equal };
        case (#fitnessReset, #fitnessReset) { #equal };
        case (#mentalHealth, #mentalHealth) { #equal };
        case (#moneySaving, #moneySaving) { #equal };
        case (#glowUp, _) { #less };
        case (#fitnessReset, #mentalHealth) { #less };
        case (#fitnessReset, #moneySaving) { #less };
        case (#mentalHealth, #moneySaving) { #less };
        case (_, #glowUp) { #greater };
        case (#mentalHealth, #fitnessReset) { #greater };
        case (#moneySaving, #fitnessReset) { #greater };
        case (#moneySaving, #mentalHealth) { #greater };
      };
    };
  };

  type Tasks = (Bool, Bool, Bool); // (task1, task2, task3)

  type Progress = {
    var challengeId : ChallengeId;
    var currentDay : Nat;
    var streak : Nat;
    var points : Nat;
    var badges : Set.Set<Text>;
    var startDate : Time.Time;
    var completedTasks : Map.Map<Nat, Tasks>;
  };

  module Tasks {
    public func fromArray(array : [Bool]) : Tasks {
      switch (array.size()) {
        case (0) { (false, false, false) };
        case (1) { (array[0], false, false) };
        case (2) { (array[0], array[1], false) };
        case (_) { (array[0], array[1], array[2]) };
      };
    };

    public func toArray(tasks : Tasks) : [Bool] {
      let (t1, t2, t3) = tasks;
      [t1, t2, t3];
    };
  };

  public type UserProfile = {
    name : Text;
  };

  module Tuple {
    public func compareByDay(tuple1 : (Nat, Tasks), tuple2 : (Nat, Tasks)) : Order.Order {
      Nat.compare(tuple1.0, tuple2.0);
    };
  };

  let progressMap = Map.empty<Principal, Progress>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func startChallenge(challengeId : ChallengeId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can start challenges");
    };

    let newProgress = {
      var challengeId;
      var currentDay = 1;
      var streak = 0;
      var points = 0;
      var badges = Set.empty<Text>();
      var startDate = Time.now();
      var completedTasks = Map.empty<Nat, Tasks>();
    };

    progressMap.add(caller, newProgress);
  };

  public shared ({ caller }) func markTaskComplete(day : Nat, taskIndex : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark tasks complete");
    };

    let progress = switch (progressMap.get(caller)) {
      case (null) { Runtime.trap("No active challenge found") };
      case (?p) { p };
    };

    if (day != progress.currentDay) { Runtime.trap("Invalid day: Task must match current day") };
    if (taskIndex > 2) { Runtime.trap("Task index must be between 0 and 2") };

    let currentTasks = switch (progress.completedTasks.get(day)) {
      case (null) { (false, false, false) };
      case (?tasks) { tasks };
    };

    var tasksArray = Tasks.toArray(currentTasks).toVarArray();
    if (tasksArray[taskIndex.toInt().toNat()]) { Runtime.trap("Task already completed") };
    tasksArray[taskIndex.toInt().toNat()] := true;

    let completedTasks = Tasks.fromArray(tasksArray.toArray());
    progress.completedTasks.add(day, completedTasks);
    progress.points += 10;

    if (tasksArray.all(func(b) { b })) {
      progress.streak += 1;
      checkAndAddBadges(progress);
      if (progress.currentDay < 30) { progress.currentDay += 1 };
    };
  };

  func checkAndAddBadges(progress : Progress) {
    let completedBadges = Set.empty<Text>();

    if (progress.streak >= 3) { completedBadges.add("day_3") };
    if (progress.streak >= 7) { completedBadges.add("day_7") };
    if (progress.streak >= 15) { completedBadges.add("day_15") };
    if (progress.streak >= 30) { completedBadges.add("day_30") };

    for (badge in completedBadges.values()) {
      if (not progress.badges.contains(badge)) {
        progress.badges.add(badge);
      };
    };
  };

  public query ({ caller }) func getProgress() : async {
    challengeId : ChallengeId;
    currentDay : Nat;
    streak : Nat;
    points : Nat;
    badges : [Text];
    startDate : Time.Time;
    completedTasks : [(Nat, Tasks)];
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get progress");
    };

    let progress = switch (progressMap.get(caller)) {
      case (null) { Runtime.trap("No active challenge found") };
      case (?p) { p };
    };

    {
      challengeId = progress.challengeId;
      currentDay = progress.currentDay;
      streak = progress.streak;
      points = progress.points;
      badges = progress.badges.toArray().sort();
      startDate = progress.startDate;
      completedTasks = progress.completedTasks.toArray().sort(Tuple.compareByDay);
    };
  };

  public query ({ caller }) func getTodayCompletion() : async (Nat, Tasks) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get today completion");
    };

    let progress = switch (progressMap.get(caller)) {
      case (null) { Runtime.trap("No active challenge found") };
      case (?p) { p };
    };

    let todayTasks = switch (progress.completedTasks.get(progress.currentDay)) {
      case (null) { (false, false, false) };
      case (?tasks) { tasks };
    };

    (progress.currentDay, todayTasks);
  };

  public shared ({ caller }) func resetChallenge() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can reset challenges");
    };
    progressMap.remove(caller);
  };
};
