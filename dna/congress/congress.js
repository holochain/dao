'use strict';

/**
 * Called only when your source chain is generated
 * @return {boolean} success
 */
function genesis() {
    var me = getMe();
    var owner = getOwner();

    // if the owner is me, then I am the progenitor so add me as the founding member
    if (owner == getMe()) {
        addMember({address:App.Key.Hash,name:"founder"});
        changeVotingRules(getInitialRules());
    }
  // any genesis code here
  return true;
}

// -----------------------------------------------------------------
//  validation functions for every DHT entry change
// -----------------------------------------------------------------


function proposalExists(hash) {
    var proposal = get(hash,{GetMask:HC.GetMask.EntryType});

    if (isErr(proposal)) return false;
    if (proposal != "proposal") return false;

    return true;
}

function validate(entryName, entry, header, pkg, sources) {
    switch(entryName) {
    case "member":
        // only the owner can add members
        var owner = getOwner();
        if (sources[0]!= owner) return false;
        return true;
    case "rules":
        // only the owner can change the rules
        var owner = getOwner();
        if (sources[0]!= owner) return false;
        return true;
    case "proposal":
        var member = isMember(sources[0]);
        if (member == null) return false;
        return true;
    case "completion":
        var rules = getVotingRules();
        var status = votingStatus(entry.proposal);
        return validateCompletion(status,rules,entry);
    case "vote":
        // voter can only vote on their own behalf
        var voter = sources[0];
        if (entry.voter != voter) return false;

        // only members can vote
        member = isMember(voter);
        if (member == null) return false;

        // proposal should exist and be a proposal
        if (!proposalExists(entry.proposal)) return false;

        // you can only vote once
        var links = getLinks(entry.proposal,"vote",{Load:true});
        if (isErr(links)) {
            links = [];
        }

        for(var i=0;i<links.length;i++) {
            if (links[i].Source == voter) return false;
        }
        return true;
    default:
        return false;
    }
}

function validateMemberLinks(links,sources) {
    // only owners can add members
    var owner = getOwner();
    if (sources[0]!= owner) return false;

    // TODO: more validation of the links here:
    return true;
}

function validateRulesLinks(links,sources) {
    // only owners can change the rules
    var owner = getOwner();
    if (sources[0]!= owner) return false;

    // TODO: more validation of the links here:
    return true;
}

function validateProposalLinks(links,sources) {
    // only members can make proposals
    var member = isMember(sources[0]);
    if (member == null) return false;

    // TODO: more validation of the links here:
    return true;
}


function validateVoteLinks(links,sources) {
    // only members can vote
    var member = isMember(sources[0]);
    if (member == null) return false;

    // TODO: more validation of the links here:
    return true;
}

function completionExists(proposalHash) {
    var lks = getLinks(proposalHash,"completion");
    if (!isErr(lks)) {
        return true;
    }
    return false;
}

function validateCompletionLinks(links,sources) {
    // only one link
    if (links.length != 1) return false;

    // tag must be completion
    if (links[0].Tag != "completion") return false;

    var proposalHash = links[0].Base;
    // you can only add a completion if it isn't already there
    if (completionExists(proposalHash)) return true;

    // proposal should exist and be a proposal
    if (!proposalExists(proposalHash)) return false;

    return true;
}

/**
 * Called to validate any changes to the DHT
 * @param {string} entryName - the name of entry being modified
 * @param {*} entry - the entry data to be set
 * @param {?} header - ?
 * @param {?} pkg - ?
 * @param {?} sources - ?
 * @return {boolean} is valid?
 */
function validateCommit (entryName, entry, header, pkg, sources) {
    switch (entryName) {
    case "member_links":
        return validateMemberLinks(entry.Links,sources);
    case "rules_links":
        return validateRulesLinks(entry.Links,sources);
    case "proposal_links":
        return validateProposalLinks(entry.Links,sources);
    case "vote_links":
        return validateVoteLinks(entry.Links,sources);
    case "completion_links":
        return validateCompletionLinks(entry.Links,sources);
    default:
        return validate(entryName,entry,header,pkg,sources);
    }
}

/**
 * Called to validate any changes to the DHT
 * @param {string} entryName - the name of entry being modified
 * @param {*}entry - the entry data to be set
 * @param {?} header - ?
 * @param {?} pkg - ?
 * @param {?} sources - ?
 * @return {boolean} is valid?
 */
function validatePut (entryName, entry, header, pkg, sources) {
    return validate(entryName,entry,header,pkg,sources);
}

/**
 * Called to validate any changes to the DHT
 * @param {string} entryName - the name of entry being modified
 * @param {*} entry- the entry data to be set
 * @param {?} header - ?
 * @param {*} replaces - the old entry data
 * @param {?} pkg - ?
 * @param {?} sources - ?
 * @return {boolean} is valid?
 */
function validateMod (entryName, entry, header, replaces, pkg, sources) {
  switch (entryName) {
    case "sampleEntry":
      // validation code here
      return false;
    default:
      // invalid entry name!!
      return false;
  }
}

/**
 * Called to validate any changes to the DHT
 * @param {string} entryName - the name of entry being modified
 * @param {string} hash - the hash of the entry to remove
 * @param {?} pkg - ?
 * @param {?} sources - ?
 * @return {boolean} is valid?
 */
function validateDel (entryName,hash, pkg, sources) {
  switch (entryName) {
    case "sampleEntry":
      // validation code here
return false;
    default:
      // invalid entry name!!
      return false;
  }
}

/**
 * Called to get the data needed to validate
 * @param {string} entryName - the name of entry to validate
 * @return {*} the data required for validation
 */
function validatePutPkg (entryName) {
  return null;
}

/**
 * Called to get the data needed to validate
 * @param {string} entryName - the name of entry to validate
 * @return {*} the data required for validation
 */
function validateModPkg (entryName) {
  return null;
}

/**
 * Called to get the data needed to validate
 * @param {string} entryName - the name of entry to validate
 * @return {*} the data required for validation
 */
function validateDelPkg (entryName) {
  return null;
}

function validateLinkPkg(entry_type) { return null;}


function validateLink(linkEntryType,baseHash,links,pkg,sources){
    //   debug("validate link: "+linkEntryType);
    switch(linkEntryType) {
    case "member_links":
        if (!validateMemberLinks(links,sources)) return false;
        return true;
    case "proposal_links":
        if (!validateProposalLinks(links,sources)) return false;
        return true;
    case "vote_links":
        if (!validateVoteLinks(links,sources)) return false;
        return true;
    case "rules_links":
        if (!validateRulesLinks(links,sources)) return false;
        return true;
    case "completion_links":
        if (!validateCompletionLinks(links,sources)) return false;
        return true;
    default:
        return false;
    }
}

function isMember(address) {
    var links = getLinks(getDirectory(),"member",{Load:true});
    if (isErr(links)) {
        links = [];
    }
    for(var i=0;i<links.length;i++) {
        if (links[i].Entry.address == address) {
            return links[i].Hash;
        }
    }
    return null;
}

function getMembers() {
    return getLinksEntries(getDirectory(),"member");
}

function getVotes(hash) {
    return getLinksEntries(hash,"vote");
}

function getVotingRules() {
    var rules = getLinksEntries(getRulesBase(),"rules");
    return rules[0];
}

function getProposals(base) {
    if (base == "") {
        base = getProposalBase();
    }
    return getLinksEntries(base,"proposal");
}

function addMember(params) {
    var directoryBaseHash = getDirectory();
    var memberEntry = {address:params.address,name:params.name,memberSince:new Date+""};
    var memberHash = commit("member",memberEntry);
    if (!isErr(memberHash)) {
        commit("member_links",{Links:[{Base:directoryBaseHash,Link:memberHash,Tag:"member"},
                                      {Base:params.address,Link:memberHash,Tag:"member"}]});
    }
    return memberHash;
}

function removeMember(memberHash) {
    var directoryBaseHash = getDirectory();
    return commit("member_links",{Links:[{Base:directoryBaseHash,Link:memberHash,Tag:"member",LinkAction:HC.LinkAction.Del},
                                         {Base:memberHash,Link:memberHash,Tag:"member",LinkAction:HC.LinkAction.Del}]});
}

function newProposal(params) {
    var proposalsBaseHash = getProposalBase();
    var proposalEntry = {
        description:params.description,
        recipient:params.recipient,
        amount:params.amount,
        votingDeadline:params.votingDeadline
    };

    var proposalHash = commit("proposal",proposalEntry);
    if (!isErr(proposalHash)) {
        commit("proposal_links",{Links:[{Base:proposalsBaseHash,Link:proposalHash,Tag:"proposal"},
                                        {Base:getMe(),Link:proposalHash,Tag:"proposal"}]});
    }
    return proposalHash;
}

function vote(params) {
    var me = getMe();
    var voteEntry = {
        proposal:params.proposal,
        inSupport:params.inSupport,
        justification:params.justification,
        voter:me
    };
    var voteHash = commit("vote",voteEntry);
    if (!isErr(voteHash)) {
        commit("vote_links",{Links:[{Base:params.proposal,Link:voteHash,Tag:"vote"},
                                    {Base:me,Link:voteHash,Tag:"vote"}]});
    }
    return voteHash;
}

function votingStatus(proposal) {
    var votes = getVotes(proposal);
    var numberOfVotes = votes.length;
    var currentResult = 0;
    for (var i=0;i<numberOfVotes;i++) {
        currentResult += votes[i].inSupport ? 1 : -1;
    }
    return {excecuted:completionExists(proposal),numberOfVotes:numberOfVotes,currentResult:currentResult};
}

function changeVotingRules(param){
    var rulesEntry = {
        minimumQuorum:param.minimumQuorum,
        debatingPeriodInMinutes:param.debatingPeriodInMinutes,
        majorityMargin:param.majorityMargin
    };
    var rulesHash = commit("rules",rulesEntry);
    if (!isErr(rulesHash)) {
        var base = getRulesBase();
        var links = [{Base:base,Link:rulesHash,Tag:"rules"}];
        var current_rules = getLinks(base,"rules");
        if (!isErr(current_rules)) {
            links.push({Base:base,Link:current_rules[0].Hash,Tag:"rules",LinkAction:HC.LinkAction.Del});
        }
        var linkHash = commit("rules_links",{Links:links});
    }
    return rulesHash;
}

function validateCompletion(status,rules,entry) {
    if (status.numberOfVotes < rules.minimumQuorum) return false;
    if (status.excecuted) return false;
    return true;
}

function executeProposal(proposal) {
    var status = votingStatus(proposal);
    var rules = getVotingRules();

    var completionEntry = {
        passed:status.currentResult > rules.majorityMargin,
        proposal:proposal
    };

    if (!validateCompletion(status,rules,completionEntry)) {
        return {"message":"Validation Failed","name":"HolochainError"};
    }

    var completionHash = commit("completion",completionEntry);
    if (!isErr(completionHash)) {
        commit("completion_links",{Links:[{Base:proposal,Link:completionHash,Tag:"completion"}]});
    }
    return completionHash;
}


// utilities -----------------------------------------------

function getDirectory() {
    return App.DNA.Hash;
}

function getProposalBase() {
    return App.DNA.Hash;
}

function getRulesBase() {
    return App.DNA.Hash;
}

function getMe() {
    return App.Key.Hash;
}

function isErr(result) {
    return ((typeof result === 'object') && result.name == "HolochainError");
}

function getOwner() {
    var owner = JSON.parse(call("owned","getOwner",{}));
    return owner;
}

function getInitialRules() {
    return {minimumQuorum:100,debatingPeriodInMinutes:1000,majorityMargin:50};
}

function getLinksEntries(baseHash,tag) {
    var links = getLinks(baseHash,tag,{Load:true});
    if (isErr(links)) {
        links = [];
    }
    var entries = [];
    for (var i=0;i<links.length;i++) {
        entries.push(links[i].Entry);
    }
    return entries;
}
