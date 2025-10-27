// Type definitions for Form.io submissions

export interface SubmissionData {
  [key: string]: unknown;
}

export interface Submission {
  _id: string;
  data: SubmissionData;
  created?: string;
  modified?: string;
  state?: string;
  owner?: string;
  form?: string;
  metadata?: {
    [key: string]: unknown;
  };
}

export interface SubmissionListProps {
  formUrl: string;
}

export interface SubmissionCardProps {
  submission: Submission;
  onViewDetails?: (submission: Submission) => void;
}

export interface SubmissionDetailModalProps {
  submission: Submission;
  formUrl: string;
  onClose: () => void;
}
