import { useState } from "react";
import LibraryHeader from "../components/LibraryHeader";
import Navigation from "../components/Navigation";
import AddAuthorForm from "../components/forms/AddAuthorForm";
import AddBookForm from "../components/forms/AddBookForm";
import AddPublisherForm from "../components/forms/AddPublisherForm";
import AddReaderForm from "../components/forms/AddReaderForm";
import AddStaffForm from "../components/forms/AddStaffForm";
import IssueBookForm from "../components/forms/IssueBookForm";
import ReturnBookForm from "../components/forms/ReturnBookForm";
import BookIssuesView from "../components/views/BookIssuesView";
import BooksView from "../components/views/BooksView";

const Index = () => {
  const [activeForm, setActiveForm] = useState("author");

  const renderActiveForm = () => {
    switch (activeForm) {
      case "author":
        return <AddAuthorForm />;
      case "book":
        return <AddBookForm />;
      case "publisher":
        return <AddPublisherForm />;
      case "staff":
        return <AddStaffForm />;
      case "reader":
        return <AddReaderForm />;
      case "issue":
        return <IssueBookForm />;
      case "return":
        return <ReturnBookForm />;
      case "books-view":
        return <BooksView />;
      case "issues-view":
        return <BookIssuesView />;
      default:
        return <AddAuthorForm />;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <LibraryHeader />
        <Navigation activeForm={activeForm} setActiveForm={setActiveForm} />
        {renderActiveForm()}
      </div>
    </div>
  );
};

export default Index;
