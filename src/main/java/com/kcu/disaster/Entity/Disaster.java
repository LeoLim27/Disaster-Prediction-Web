package com.kcu.disaster.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "disasters")
@Getter
@Setter
public class Disaster {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String femaDeclarationString;
  private String disasterNumber;
  private String state;
  private String declarationType;
  private String declarationDate;
  private String fyDeclared;
  private String declarationTitle;
  private String ihProgramDeclared;
  private String iaProgramDeclared;
  private String paProgramDeclared;
  private String hmProgramDeclared;
  private String incidentBeginDate;
  private String incidentEndDate;
  private String disasterCloseoutDate;
  private String tribalRequest;
  private String fipsStateCode;
  private String fipsCountyCode;
  private String placeCode;
  private String designatedArea;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public void setFemaDeclarationString(String femaDeclarationString) {
    this.femaDeclarationString = femaDeclarationString;
  }

  public void setDisasterNumber(String disasterNumber) {
    this.disasterNumber = disasterNumber;
  }

  public void setState(String state) {
    this.state = state;
  }

  public void setDeclarationType(String declarationType) {
    this.declarationType = declarationType;
  }

  public void setDeclarationDate(String declarationDate) {
    this.declarationDate = declarationDate;
  }

  public void setFyDeclared(String fyDeclared) {
    this.fyDeclared = fyDeclared;
  }

  public void setIhProgramDeclared(String ihProgramDeclared) {
    this.ihProgramDeclared = ihProgramDeclared;
  }

  public void setDeclarationTitle(String declarationTitle) {
    this.declarationTitle = declarationTitle;
  }

  public void setIaProgramDeclared(String iaProgramDeclared) {
    this.iaProgramDeclared = iaProgramDeclared;
  }

  public void setHmProgramDeclared(String hmProgramDeclared) {
    this.hmProgramDeclared = hmProgramDeclared;
  }

  public void setPaProgramDeclared(String paProgramDeclared) {
    this.paProgramDeclared = paProgramDeclared;
  }

  public void setIncidentBeginDate(String incidentBeginDate) {
    this.incidentBeginDate = incidentBeginDate;
  }

  public void setIncidentEndDate(String incidentEndDate) {
    this.incidentEndDate = incidentEndDate;
  }

  public void setTribalRequest(String tribalRequest) {
    this.tribalRequest = tribalRequest;
  }

  public void setDisasterCloseoutDate(String disasterCloseoutDate) {
    this.disasterCloseoutDate = disasterCloseoutDate;
  }

  public void setFipsStateCode(String fipsStateCode) {
    this.fipsStateCode = fipsStateCode;
  }

  public void setFipsCountyCode(String fipsCountyCode) {
    this.fipsCountyCode = fipsCountyCode;
  }

  public void setPlaceCode(String placeCode) {
    this.placeCode = placeCode;
  }

  public void setDesignatedArea(String designatedArea) {
    this.designatedArea = designatedArea;
  }

  public void setDeclarationRequestNumber(String declarationRequestNumber) {
    this.declarationRequestNumber = declarationRequestNumber;
  }

  public void setLastIAFilingDate(String lastIAFilingDate) {
    this.lastIAFilingDate = lastIAFilingDate;
  }

  public void setIncidentId(String incidentId) {
    this.incidentId = incidentId;
  }

  public void setRegion(String region) {
    this.region = region;
  }

  public void setDesignatedIncidentTypes(String designatedIncidentTypes) {
    this.designatedIncidentTypes = designatedIncidentTypes;
  }

  public void setLastRefresh(String lastRefresh) {
    this.lastRefresh = lastRefresh;
  }

  public String getFemaDeclarationString() {
    return femaDeclarationString;
  }

  public String getDisasterNumber() {
    return disasterNumber;
  }

  public String getState() {
    return state;
  }

  public String getDeclarationType() {
    return declarationType;
  }

  public String getDeclarationDate() {
    return declarationDate;
  }

  public String getFyDeclared() {
    return fyDeclared;
  }

  public String getDeclarationTitle() {
    return declarationTitle;
  }

  public String getIhProgramDeclared() {
    return ihProgramDeclared;
  }

  public String getIaProgramDeclared() {
    return iaProgramDeclared;
  }

  public String getPaProgramDeclared() {
    return paProgramDeclared;
  }

  public String getHmProgramDeclared() {
    return hmProgramDeclared;
  }

  public String getIncidentBeginDate() {
    return incidentBeginDate;
  }

  public String getIncidentEndDate() {
    return incidentEndDate;
  }

  public String getDisasterCloseoutDate() {
    return disasterCloseoutDate;
  }

  public String getTribalRequest() {
    return tribalRequest;
  }

  public String getFipsStateCode() {
    return fipsStateCode;
  }

  public String getFipsCountyCode() {
    return fipsCountyCode;
  }

  public String getPlaceCode() {
    return placeCode;
  }

  public String getDesignatedArea() {
    return designatedArea;
  }

  public String getDeclarationRequestNumber() {
    return declarationRequestNumber;
  }

  public String getLastIAFilingDate() {
    return lastIAFilingDate;
  }

  public String getIncidentId() {
    return incidentId;
  }

  public String getRegion() {
    return region;
  }

  public String getDesignatedIncidentTypes() {
    return designatedIncidentTypes;
  }

  public String getLastRefresh() {
    return lastRefresh;
  }

  private String declarationRequestNumber;
  private String lastIAFilingDate;
  private String incidentId;
  private String region;
  private String designatedIncidentTypes;
  private String lastRefresh;

  // 기본 생성자
  public Disaster() {}

}
